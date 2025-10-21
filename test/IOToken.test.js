const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IOToken", function () {
  let ioToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const IOToken = await ethers.getContractFactory("IOToken");
    ioToken = await IOToken.deploy(owner.address);
    await ioToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ioToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await ioToken.balanceOf(owner.address);
      expect(await ioToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct token details", async function () {
      expect(await ioToken.name()).to.equal("Incrypt Oracle Token");
      expect(await ioToken.symbol()).to.equal("IO");
      expect(await ioToken.totalSupply()).to.equal(ethers.parseEther("1000000000"));
    });
  });

  describe("Transfer Restrictions", function () {
    it("Should allow owner to transfer any amount", async function () {
      const amount = ethers.parseEther("50000000"); // 5% of supply
      await expect(ioToken.transfer(addr1.address, amount)).to.not.be.reverted;
    });

    it("Should restrict large transfers from non-exempt addresses", async function () {
      const amount = ethers.parseEther("50000000"); // 5% of supply
      await ioToken.transfer(addr1.address, ethers.parseEther("1000"));
      
      await expect(
        ioToken.connect(addr1).transfer(addr2.address, amount)
      ).to.be.revertedWith("IOToken: Transfer amount exceeds maximum allowed");
    });

    it("Should allow transfers within limit", async function () {
      const amount = ethers.parseEther("5000000"); // 0.5% of supply
      await ioToken.transfer(addr1.address, amount);
      
      await expect(
        ioToken.connect(addr1).transfer(addr2.address, amount)
      ).to.not.be.reverted;
    });
  });

  describe("Voting Functionality", function () {
    it("Should delegate votes", async function () {
      await ioToken.transfer(addr1.address, ethers.parseEther("1000"));
      
      await ioToken.connect(addr1).delegate(addr1.address);
      
      expect(await ioToken.getVotes(addr1.address)).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Admin Functions", function () {
    it("Should toggle transfer restrictions", async function () {
      await ioToken.toggleTransferRestrictions(false);
      expect(await ioToken.transferRestrictionsEnabled()).to.equal(false);
      
      // Now large transfers should work
      const amount = ethers.parseEther("50000000");
      await ioToken.transfer(addr1.address, amount);
      
      await expect(
        ioToken.connect(addr1).transfer(addr2.address, amount)
      ).to.not.be.reverted;
    });

    it("Should update exemptions", async function () {
      await ioToken.updateExemption(addr1.address, true);
      expect(await ioToken.exemptFromRestrictions(addr1.address)).to.equal(true);
      
      // Exempt address should be able to transfer large amounts
      const amount = ethers.parseEther("50000000");
      await ioToken.transfer(addr1.address, amount);
      
      await expect(
        ioToken.connect(addr1).transfer(addr2.address, amount)
      ).to.not.be.reverted;
    });
  });
});
