const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Prediction Market Integration Flow", function () {
  let oracle;
  let token;
  let market;
  let owner;
  let user1;
  let user2;
  let validator1;

  beforeEach(async function () {
    [owner, user1, user2, validator1] = await ethers.getSigners();

    // Deploy token
    const IOToken = await ethers.getContractFactory("IOToken");
    token = await IOToken.deploy(owner.address);
    await token.waitForDeployment();

    // Deploy oracle
    const IncryptOracle = await ethers.getContractFactory("IncryptOracle");
    oracle = await IncryptOracle.deploy(owner.address);
    await oracle.waitForDeployment();

    // Deploy prediction market
    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    market = await PredictionMarket.deploy(
      token.target,
      oracle.target,
      owner.address,
      owner.address
    );
    await market.waitForDeployment();

    // Mint tokens
    const mintAmount = ethers.parseEther("100000");
    await token.mint(user1.address, mintAmount);
    await token.mint(user2.address, mintAmount);
    await token.mint(validator1.address, mintAmount);

    // Register validator
    const stakeAmount = ethers.parseEther("1000");
    await token.connect(validator1).approve(oracle.target, stakeAmount);
    await oracle.connect(validator1).registerValidator(stakeAmount);
  });

  describe("Full Prediction Market Flow: Create → Trade → Resolve → Claim", function () {
    let marketId;
    let feedId;
    const initialLiquidity = ethers.parseEther("10000");
    const duration = 7 * 24 * 60 * 60; // 7 days

    beforeEach(async function () {
      // Create oracle feed
      const tx = await oracle.createDataFeed(
        "BTC/USD",
        "Bitcoin price in USD",
        1
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'DataFeedCreated'
      );
      feedId = event.args.feedId;

      // Submit validation to activate feed
      await oracle.connect(validator1).submitValidation(
        feedId,
        50000 * 10000, // $50,000 scaled
        "Test API"
      );
    });

    it("Should complete full prediction market lifecycle", async function () {
      // Step 1: Create market
      await token.connect(user1).approve(market.target, initialLiquidity);
      
      const createTx = await market.connect(user1).createMarket(
        "Will Bitcoin reach $100k?",
        "Prediction on BTC price",
        "Crypto",
        duration,
        feedId,
        initialLiquidity
      );
      
      const createReceipt = await createTx.wait();
      const createEvent = createReceipt.logs.find(log => 
        log.fragment && log.fragment.name === 'MarketCreated'
      );
      marketId = Number(createEvent.args.marketId);

      expect(marketId).to.not.be.undefined;

      // Verify market created
      const marketData = await market.markets(marketId);
      expect(marketData.question).to.equal("Will Bitcoin reach $100k?");
      expect(Number(marketData.totalLiquidity)).to.equal(Number(initialLiquidity));

      // Step 2: User buys shares
      const betAmount = ethers.parseEther("1000");
      await token.connect(user2).approve(market.target, betAmount * 2n);
      
      // Calculate cost first
      const cost = await market.calculateCost(marketId, 1, betAmount); // Yes = 1
      
      // Buy YES shares
      const buyTx = await market.connect(user2).buyShares(marketId, 1, betAmount);
      await buyTx.wait();

      // Verify position
      const position = await market.getUserPosition(marketId, user2.address);
      expect(Number(position[1])).to.be.greaterThan(0); // Yes shares > 0

      // Step 3: Another user buys NO shares
      const betAmount2 = ethers.parseEther("500");
      const cost2 = await market.calculateCost(marketId, 0, betAmount2); // No = 0
      await token.connect(user1).approve(market.target, cost2);
      
      await market.connect(user1).buyShares(marketId, 0, betAmount2);

      // Step 4: Fast-forward time to resolution
      await time.increase(duration + 2 * 60 * 60); // Add 2 hours buffer

      // Step 5: Update oracle with resolution data
      const resolutionValue = 60000 * 10000; // $60k (Yes wins if > $50k threshold)
      await oracle.connect(validator1).submitValidation(
        feedId,
        resolutionValue,
        "Resolution API"
      );

      // Wait for oracle to resolve
      await time.increase(1 * 60 * 60);

      // Step 6: Resolve market
      await expect(
        market.resolveMarket(marketId)
      ).to.emit(market, "MarketResolved");

      const resolvedMarket = await market.markets(marketId);
      expect(resolvedMarket.state).to.equal(1); // Resolved = 1
      expect(Number(resolvedMarket.winningOutcome)).to.equal(1); // Yes = 1

      // Step 7: Claim winnings
      const user2BalanceBefore = await token.balanceOf(user2.address);
      
      await expect(
        market.connect(user2).claimWinnings(marketId)
      ).to.not.be.reverted;

      const user2BalanceAfter = await token.balanceOf(user2.address);
      expect(user2BalanceAfter).to.be.greaterThan(user2BalanceBefore);
    });

    it("Should prevent buying shares after market ends", async function () {
      await token.connect(user1).approve(market.target, initialLiquidity);
      
      const createTx = await market.connect(user1).createMarket(
        "Test Market",
        "Test Description",
        "Test",
        duration,
        feedId,
        initialLiquidity
      );
      const createReceipt = await createTx.wait();
      const createEvent = createReceipt.logs.find(log => 
        log.fragment && log.fragment.name === 'MarketCreated'
      );
      const marketId = Number(createEvent.args.marketId);

      // Fast-forward past end time
      await time.increase(duration + 1);

      // Try to buy shares - should fail
      const betAmount = ethers.parseEther("100");
      await token.connect(user2).approve(market.target, betAmount * 10n);
      
      await expect(
        market.connect(user2).buyShares(marketId, 1, betAmount)
      ).to.be.revertedWith("Market ended");
    });

    it("Should handle input validation correctly", async function () {
      await token.connect(user1).approve(market.target, initialLiquidity);
      
      const createTx = await market.connect(user1).createMarket(
        "Test Market",
        "Test Description",
        "Test",
        duration,
        feedId,
        initialLiquidity
      );
      const createReceipt = await createTx.wait();
      const createEvent = createReceipt.logs.find(log => 
        log.fragment && log.fragment.name === 'MarketCreated'
      );
      const marketId = Number(createEvent.args.marketId);

      // Try to buy with zero amount - should fail
      await expect(
        market.connect(user2).buyShares(marketId, 1, 0)
      ).to.be.revertedWith("Amount must be greater than 0");

      // Buy some shares first to create pool
      const betAmount = ethers.parseEther("1000");
      await token.connect(user2).approve(market.target, betAmount * 10n);
      await market.connect(user2).buyShares(marketId, 1, betAmount);

      // Try to sell more shares than owned - should fail
      const position = await market.getUserPosition(marketId, user2.address);
      const sharesOwned = position[1]; // Yes shares
      
      await expect(
        market.connect(user2).sellShares(marketId, 1, sharesOwned + 1n)
      ).to.be.revertedWith("Insufficient shares");
    });
  });
});

