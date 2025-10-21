const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IncryptOracle", function () {
  let oracle;
  let owner;
  let validator1;
  let validator2;
  let validator3;

  beforeEach(async function () {
    [owner, validator1, validator2, validator3] = await ethers.getSigners();
    
    const IncryptOracle = await ethers.getContractFactory("IncryptOracle");
    oracle = await IncryptOracle.deploy(owner.address);
    await oracle.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await oracle.owner()).to.equal(owner.address);
    });
  });

  describe("Data Feed Management", function () {
    it("Should create a data feed", async function () {
      const tx = await oracle.createDataFeed("BTC/USD", "Bitcoin price in USD", 3);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'DataFeedCreated');
      expect(event).to.not.be.undefined;
    });

    it("Should get data feed information", async function () {
      await oracle.createDataFeed("ETH/USD", "Ethereum price in USD", 3);
      const feedIds = await oracle.getActiveFeedIds();
      expect(feedIds.length).to.equal(1);
      
      const feedInfo = await oracle.getDataFeed(feedIds[0]);
      expect(feedInfo.name).to.equal("ETH/USD");
      expect(feedInfo.description).to.equal("Ethereum price in USD");
      expect(feedInfo.isActive).to.equal(true);
    });
  });

  describe("Validator Management", function () {
    it("Should register a validator", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      // Mock token transfer (in real test, you'd deploy token first)
      await expect(
        oracle.connect(validator1).registerValidator(stakeAmount)
      ).to.not.be.reverted;
      
      const validatorInfo = await oracle.getValidator(validator1.address);
      expect(validatorInfo.isActive).to.equal(true);
      expect(validatorInfo.stake).to.equal(stakeAmount);
    });

    it("Should not allow duplicate validator registration", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await oracle.connect(validator1).registerValidator(stakeAmount);
      
      await expect(
        oracle.connect(validator1).registerValidator(stakeAmount)
      ).to.be.revertedWith("Already registered");
    });
  });

  describe("Data Validation", function () {
    let feedId;

    beforeEach(async function () {
      // Create a data feed
      const tx = await oracle.createDataFeed("TEST/USD", "Test price", 2);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'DataFeedCreated');
      feedId = event.args.feedId;

      // Register validators
      await oracle.connect(validator1).registerValidator(ethers.parseEther("1000"));
      await oracle.connect(validator2).registerValidator(ethers.parseEther("1000"));
    });

    it("Should submit validations", async function () {
      await expect(
        oracle.connect(validator1).submitValidation(feedId, 50000, "Exchange API")
      ).to.not.be.reverted;
    });

    it("Should not allow duplicate submissions", async function () {
      await oracle.connect(validator1).submitValidation(feedId, 50000, "Exchange API");
      
      await expect(
        oracle.connect(validator1).submitValidation(feedId, 51000, "Another source")
      ).to.be.revertedWith("Already submitted");
    });
  });

  describe("Emergency Functions", function () {
    it("Should pause and unpause", async function () {
      await oracle.pause();
      expect(await oracle.paused()).to.equal(true);
      
      await oracle.unpause();
      expect(await oracle.paused()).to.equal(false);
    });

    it("Should deactivate data feed", async function () {
      const tx = await oracle.createDataFeed("TEST/USD", "Test price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'DataFeedCreated');
      const feedId = event.args.feedId;
      
      await oracle.deactivateDataFeed(feedId);
      
      const feedInfo = await oracle.getDataFeed(feedId);
      expect(feedInfo.isActive).to.equal(false);
    });
  });
});
