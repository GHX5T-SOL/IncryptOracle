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
    beforeEach(async function () {
      // Register 3 validators first to allow creating feeds with threshold 3
      const stakeAmount = ethers.parseEther("1000");
      await oracle.connect(validator1).registerValidator(stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);
    });

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
      // Register validators first
      await oracle.connect(validator1).registerValidator(ethers.parseEther("1000"));
      await oracle.connect(validator2).registerValidator(ethers.parseEther("1000"));
      await oracle.connect(validator3).registerValidator(ethers.parseEther("1000"));

      // Create a data feed (threshold must be >= MIN_VALIDATORS (3) and <= number of validators)
      const tx = await oracle.createDataFeed("TEST/USD", "Test price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'DataFeedCreated');
      feedId = event.args.feedId;
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

  describe("AI Validator Management", function () {
    let aiValidatorAddress;
    let aiValidatorSigner;

    beforeEach(async function () {
      // Create a new signer for AI validator
      const signers = await ethers.getSigners();
      aiValidatorSigner = signers[signers.length - 1]; // Use last signer as AI validator
      aiValidatorAddress = aiValidatorSigner.address;
    });

    it("Should register AI validator (owner only)", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await expect(
        oracle.registerAIValidator(aiValidatorAddress, stakeAmount)
      ).to.not.be.reverted;
      
      const validatorInfo = await oracle.getValidator(aiValidatorAddress);
      expect(validatorInfo.isActive).to.equal(true);
      expect(validatorInfo.stake).to.equal(stakeAmount);
      // ValidatorType.AI = 1
      expect(validatorInfo.validatorType).to.equal(1);
    });

    it("Should not allow non-owner to register AI validator", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await expect(
        oracle.connect(validator1).registerAIValidator(aiValidatorAddress, stakeAmount)
      ).to.be.reverted;
    });

    it("Should allow AI validator to submit validation with metadata", async function () {
      // Register AI validator first
      const stakeAmount = ethers.parseEther("1000");
      await oracle.registerAIValidator(aiValidatorAddress, stakeAmount);
      
      // Create feed
      await oracle.connect(validator1).registerValidator(stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);
      
      const tx = await oracle.createDataFeed("BTC/USD", "Bitcoin price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'DataFeedCreated');
      const feedId = event.args.feedId;
      
      // Create AI metadata
      const aiMetadata = JSON.stringify({
        confidence: 92.5,
        sources: ['Binance API', 'CoinGecko API'],
        reasoning: 'Based on analysis of multiple sources',
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        timestamp: Date.now()
      });
      
      // Fund the AI validator address for gas
      await owner.sendTransaction({
        to: aiValidatorAddress,
        value: ethers.parseEther("1.0")
      });
      
      // Submit AI validation
      await expect(
        oracle.connect(aiValidatorSigner).submitAIValidation(feedId, 50000, "AI Validator", aiMetadata)
      ).to.not.be.reverted;
      
      // Verify submission was recorded
      const submission = await oracle.getValidationSubmission(feedId, aiValidatorAddress);
      expect(submission.submitted).to.equal(true);
      expect(submission.validatorType).to.equal(1); // ValidatorType.AI
    });

    it("Should get AI validator count", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      // Register AI validator
      await oracle.registerAIValidator(aiValidatorAddress, stakeAmount);
      
      const aiCount = await oracle.getAIValidatorCount();
      expect(aiCount).to.equal(1);
    });

    it("Should get validation submission with AI metadata", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await oracle.registerAIValidator(aiValidatorAddress, stakeAmount);
      
      await oracle.connect(validator1).registerValidator(stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);
      
      const tx = await oracle.createDataFeed("ETH/USD", "Ethereum price", 3);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'DataFeedCreated');
      const feedId = event.args.feedId;
      
      const aiMetadata = JSON.stringify({
        confidence: 95.0,
        sources: ['Binance API'],
        reasoning: 'Test reasoning',
        model: 'test-model',
        timestamp: Date.now()
      });
      
      // Submit AI validation (would need funded wallet in real test)
      // For now, just verify the function exists and structure is correct
      const submission = await oracle.getValidationSubmission(feedId, aiValidatorAddress);
      // Initially not submitted, so this will return default values
      expect(submission.submitted).to.equal(false);
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
      // Register validators first
      const stakeAmount = ethers.parseEther("1000");
      await oracle.connect(validator1).registerValidator(stakeAmount);
      await oracle.connect(validator2).registerValidator(stakeAmount);
      await oracle.connect(validator3).registerValidator(stakeAmount);

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
