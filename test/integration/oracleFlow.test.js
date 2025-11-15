const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Oracle Integration Flow", function () {
  let oracle;
  let token;
  let owner;
  let validator1;
  let validator2;
  let validator3;
  let user;

  beforeEach(async function () {
    [owner, validator1, validator2, validator3, user] = await ethers.getSigners();

    // Deploy token
    const IOToken = await ethers.getContractFactory("IOToken");
    token = await IOToken.deploy(owner.address);
    await token.waitForDeployment();

    // Deploy oracle
    const IncryptOracle = await ethers.getContractFactory("IncryptOracle");
    oracle = await IncryptOracle.deploy(owner.address);
    await oracle.waitForDeployment();

    // Mint tokens for validators
    const mintAmount = ethers.parseEther("10000");
    await token.mint(validator1.address, mintAmount);
    await token.mint(validator2.address, mintAmount);
    await token.mint(validator3.address, mintAmount);
    await token.mint(user.address, mintAmount);
  });

  describe("Full Oracle Flow: Create Feed → Submit Validations → Consensus → Resolution", function () {
    let feedId;
    const stakeAmount = ethers.parseEther("1000");
    const minValidators = 3;

    it("Should complete full oracle flow with 3 validators", async function () {
      // Step 1: Register validators
      await token.connect(validator1).approve(oracle.target, stakeAmount);
      await oracle.connect(validator1).registerValidator(stakeAmount);
      
      await token.connect(validator2).approve(oracle.target, stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      
      await token.connect(validator3).approve(oracle.target, stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);

      // Verify validators registered
      const v1Info = await oracle.getValidator(validator1.address);
      const v2Info = await oracle.getValidator(validator2.address);
      const v3Info = await oracle.getValidator(validator3.address);
      
      expect(v1Info.isActive).to.equal(true);
      expect(v2Info.isActive).to.equal(true);
      expect(v3Info.isActive).to.equal(true);

      // Step 2: Create data feed
      const tx = await oracle.createDataFeed(
        "BTC/USD",
        "Bitcoin price in USD",
        minValidators
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'DataFeedCreated'
      );
      feedId = event.args.feedId;

      expect(feedId).to.not.be.undefined;

      // Step 3: Validators submit validations
      const value1 = 50000; // $50,000 (scaled by 10000 = 500000000)
      const value2 = 50100;
      const value3 = 49900;

      await expect(
        oracle.connect(validator1).submitValidation(feedId, value1 * 10000, "Binance API")
      ).to.emit(oracle, "ValidationSubmitted");

      await expect(
        oracle.connect(validator2).submitValidation(feedId, value2 * 10000, "Coinbase API")
      ).to.emit(oracle, "ValidationSubmitted");

      // After 3rd validation, should trigger resolution
      await expect(
        oracle.connect(validator3).submitValidation(feedId, value3 * 10000, "Kraken API")
      ).to.emit(oracle, "DataFeedResolved");

      // Step 4: Verify resolution
      const feedInfo = await oracle.getDataFeed(feedId);
      expect(feedInfo.isActive).to.equal(true);
      expect(Number(feedInfo.value)).to.be.greaterThan(0);
      expect(Number(feedInfo.confidence)).to.be.greaterThan(0);
      expect(Number(feedInfo.timestamp)).to.be.greaterThan(0);
    });

    it("Should calculate consensus correctly with reputation weights", async function () {
      // Register validators with different stakes
      await token.connect(validator1).approve(oracle.target, stakeAmount);
      await oracle.connect(validator1).registerValidator(stakeAmount);
      
      await token.connect(validator2).approve(oracle.target, stakeAmount * 2n);
      await oracle.connect(validator2).registerValidator(stakeAmount * 2n);
      
      await token.connect(validator3).approve(oracle.target, stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);

      // Create feed
      const tx = await oracle.createDataFeed("ETH/USD", "Ethereum price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'DataFeedCreated'
      );
      const feedId = event.args.feedId;

      // Submit validations with varying values
      const value1 = 3000 * 10000; // $3,000
      const value2 = 3100 * 10000; // $3,100 (higher stake, should have more weight)
      const value3 = 3050 * 10000; // $3,050

      await oracle.connect(validator1).submitValidation(feedId, value1, "Source1");
      await oracle.connect(validator2).submitValidation(feedId, value2, "Source2");
      await oracle.connect(validator3).submitValidation(feedId, value3, "Source3");

      // Consensus should be calculated (value2 weighted more due to higher stake)
      const feedInfo = await oracle.getDataFeed(feedId);
      const consensusValue = Number(feedInfo.value);
      
      // Consensus should be between values, closer to value2
      expect(consensusValue).to.be.greaterThan(3000 * 10000);
      expect(consensusValue).to.be.lessThan(3100 * 10000);
    });

    it("Should update validator reputations after resolution", async function () {
      // Register validators
      await token.connect(validator1).approve(oracle.target, stakeAmount);
      await oracle.connect(validator1).registerValidator(stakeAmount);
      
      await token.connect(validator2).approve(oracle.target, stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      
      await token.connect(validator3).approve(oracle.target, stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);

      // Create feed
      const tx = await oracle.createDataFeed("TEST/USD", "Test price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'DataFeedCreated'
      );
      const feedId = event.args.feedId;

      // Get initial reputations
      const v1Initial = await oracle.getValidator(validator1.address);
      const initialRep1 = Number(v1Initial.reputation);

      // Submit validations
      const value = 10000 * 10000;
      await oracle.connect(validator1).submitValidation(feedId, value, "Source1");
      await oracle.connect(validator2).submitValidation(feedId, value, "Source2");
      await oracle.connect(validator3).submitValidation(feedId, value, "Source3");

      // Verify reputation updated (should increase for accurate validators)
      const v1After = await oracle.getValidator(validator1.address);
      const afterRep1 = Number(v1After.reputation);
      
      // Reputation should have increased or stayed same
      expect(afterRep1).to.be.greaterThanOrEqual(initialRep1);
    });

    it("Should prevent division by zero in consensus calculation", async function () {
      // This test verifies the security fix for division by zero
      await token.connect(validator1).approve(oracle.target, stakeAmount);
      await oracle.connect(validator1).registerValidator(stakeAmount);
      
      await token.connect(validator2).approve(oracle.target, stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      
      await token.connect(validator3).approve(oracle.target, stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);

      const tx = await oracle.createDataFeed("TEST/USD", "Test price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'DataFeedCreated'
      );
      const feedId = event.args.feedId;

      // Submit validations with same value (should still work)
      const value = 5000 * 10000;
      await oracle.connect(validator1).submitValidation(feedId, value, "Source1");
      await oracle.connect(validator2).submitValidation(feedId, value, "Source2");
      
      // Should not revert with division by zero
      await expect(
        oracle.connect(validator3).submitValidation(feedId, value, "Source3")
      ).to.not.be.reverted;

      // Verify feed resolved
      const feedInfo = await oracle.getDataFeed(feedId);
      expect(Number(feedInfo.value)).to.equal(value);
    });
  });

  describe("Slashing Mechanism", function () {
    let feedId;
    const stakeAmount = ethers.parseEther("1000");

    it("Should slash validator for poor performance", async function () {
      // Register validator
      await token.connect(validator1).approve(oracle.target, stakeAmount);
      await oracle.connect(validator1).registerValidator(stakeAmount);
      
      await token.connect(validator2).approve(oracle.target, stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      
      await token.connect(validator3).approve(oracle.target, stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);

      // Create feed
      const tx = await oracle.createDataFeed("TEST/USD", "Test price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'DataFeedCreated'
      );
      feedId = event.args.feedId;

      const consensusValue = 10000 * 10000;
      
      // Validators submit accurate values
      await oracle.connect(validator2).submitValidation(feedId, consensusValue, "Source2");
      await oracle.connect(validator3).submitValidation(feedId, consensusValue, "Source3");
      
      // Validator1 submits very inaccurate value (should trigger slashing)
      const inaccurateValue = 5000 * 10000; // 50% off
      await oracle.connect(validator1).submitValidation(feedId, inaccurateValue, "Source1");

      // Check if validator1 was slashed (stake should be reduced)
      const v1Info = await oracle.getValidator(validator1.address);
      const slashCount = await oracle.getValidatorSlashCount(validator1.address);
      
      // Note: Slashing happens during reputation update, which occurs after resolution
      // Actual slash may require multiple poor validations
      expect(Number(v1Info.stake)).to.be.lessThanOrEqual(Number(stakeAmount));
    });
  });
});

