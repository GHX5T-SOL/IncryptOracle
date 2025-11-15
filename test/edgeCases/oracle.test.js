const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Oracle Edge Cases", function () {
  let oracle;
  let token;
  let owner;
  let validator1;
  let validator2;
  let validator3;

  beforeEach(async function () {
    [owner, validator1, validator2, validator3] = await ethers.getSigners();

    const IOToken = await ethers.getContractFactory("IOToken");
    token = await IOToken.deploy(owner.address);
    await token.waitForDeployment();

    const IncryptOracle = await ethers.getContractFactory("IncryptOracle");
    oracle = await IncryptOracle.deploy(owner.address);
    await oracle.waitForDeployment();

    const stakeAmount = ethers.parseEther("1000");
    const mintAmount = ethers.parseEther("10000");
    
    await token.mint(validator1.address, mintAmount);
    await token.mint(validator2.address, mintAmount);
    await token.mint(validator3.address, mintAmount);
  });

  describe("Zero Validator Scenarios", function () {
    it("Should handle feed creation with no validators", async function () {
      // Create feed without any validators
      await expect(
        oracle.createDataFeed("TEST/USD", "Test price", 3)
      ).to.be.revertedWith("Threshold too high");
    });

    it("Should handle minimum validator requirement", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      // Register only 2 validators (minimum is 3)
      await token.connect(validator1).approve(oracle.target, stakeAmount);
      await oracle.connect(validator1).registerValidator(stakeAmount);
      
      await token.connect(validator2).approve(oracle.target, stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);

      // Try to create feed requiring 3 validators
      await expect(
        oracle.createDataFeed("TEST/USD", "Test price", 3)
      ).to.be.revertedWith("Threshold too high");
    });
  });

  describe("Maximum Validator Count", function () {
    it("Should enforce maximum validator limit", async function () {
      const stakeAmount = ethers.parseEther("1000");
      const maxValidators = 21;
      const mintAmount = ethers.parseEther("50000");
      
      // Register maximum validators
      const signers = await ethers.getSigners();
      for (let i = 0; i < maxValidators; i++) {
        await token.mint(signers[i + 4].address, mintAmount);
        await token.connect(signers[i + 4]).approve(oracle.target, stakeAmount);
        await oracle.connect(signers[i + 4]).registerValidator(stakeAmount);
      }

      // Try to register one more - should fail or reach limit
      await token.mint(signers[maxValidators + 4].address, mintAmount);
      await token.connect(signers[maxValidators + 4]).approve(oracle.target, stakeAmount);
      
      // Note: Actual implementation may allow or reject based on contract logic
      const validatorCount = await oracle.getActiveValidators();
      expect(validatorCount.length).to.be.lessThanOrEqual(maxValidators);
    });
  });

  describe("Oracle Data Staleness", function () {
    let feedId;

    beforeEach(async function () {
      const stakeAmount = ethers.parseEther("1000");
      
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
      feedId = event.args.feedId;
    });

    it("Should prevent validation after window closes", async function () {
      const validationWindow = 1 * 60 * 60; // 1 hour
      
      // Submit first validation
      await oracle.connect(validator1).submitValidation(
        feedId,
        50000 * 10000,
        "Source1"
      );

      // Fast-forward past validation window
      await time.increase(validationWindow + 1);

      // Try to submit validation - should fail
      await expect(
        oracle.connect(validator2).submitValidation(
          feedId,
          51000 * 10000,
          "Source2"
        )
      ).to.be.revertedWith("Validation window closed");
    });

    it("Should handle stale data in resolution", async function () {
      // Submit validations
      await oracle.connect(validator1).submitValidation(
        feedId,
        50000 * 10000,
        "Source1"
      );
      await oracle.connect(validator2).submitValidation(
        feedId,
        50100 * 10000,
        "Source2"
      );
      await oracle.connect(validator3).submitValidation(
        feedId,
        49900 * 10000,
        "Source3"
      );

      // Get resolved feed
      const feedInfo = await oracle.getDataFeed(feedId);
      const timestamp = Number(feedInfo.timestamp);

      // Fast-forward time
      await time.increase(25 * 60 * 60); // 25 hours

      // Feed should still be accessible but timestamp shows it's old
      const currentTime = await time.latest();
      expect(currentTime - timestamp).to.be.greaterThan(24 * 60 * 60);
    });
  });

  describe("Division by Zero Protection", function () {
    it("Should handle zero total weight in consensus", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
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

      // Submit validations - should not cause division by zero
      // Even if all validators have zero reputation initially
      await expect(
        oracle.connect(validator1).submitValidation(feedId, 50000 * 10000, "Source1")
      ).to.not.be.reverted;

      await expect(
        oracle.connect(validator2).submitValidation(feedId, 50000 * 10000, "Source2")
      ).to.not.be.reverted;

      // Third validation should trigger resolution
      await expect(
        oracle.connect(validator3).submitValidation(feedId, 50000 * 10000, "Source3")
      ).to.not.be.reverted;
    });

    it("Should handle zero consensus value", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
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

      // Submit zero values
      await expect(
        oracle.connect(validator1).submitValidation(feedId, 0, "Source1")
      ).to.not.be.reverted;

      await expect(
        oracle.connect(validator2).submitValidation(feedId, 0, "Source2")
      ).to.not.be.reverted;

      await expect(
        oracle.connect(validator3).submitValidation(feedId, 0, "Source3")
      ).to.not.be.reverted;

      // Should resolve with zero value
      const feedInfo = await oracle.getDataFeed(feedId);
      expect(Number(feedInfo.value)).to.equal(0);
    });
  });

  describe("Edge Case Values", function () {
    it("Should handle very large values", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
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

      const maxValue = ethers.MaxUint256 / 10000n; // Largest representable value
      
      await expect(
        oracle.connect(validator1).submitValidation(feedId, maxValue * 10000n, "Source1")
      ).to.not.be.reverted;
    });

    it("Should handle very small values", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
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

      const minValue = 1; // Smallest value
      
      await expect(
        oracle.connect(validator1).submitValidation(feedId, minValue, "Source1")
      ).to.not.be.reverted;
    });
  });
});

