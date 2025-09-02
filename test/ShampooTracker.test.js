const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ShampooTracker", function () {
  let shampooTracker;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const ShampooTrackerFactory = await ethers.getContractFactory("ShampooTracker");
    shampooTracker = await ShampooTrackerFactory.deploy();
    await shampooTracker.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await shampooTracker.getAddress()).to.be.properAddress;
    });
  });

  describe("Record Shampoo", function () {
    it("Should record shampoo for user", async function () {
      // Record shampoo
      await shampooTracker.connect(user1).recordShampoo();

      // Check count
      const count = await shampooTracker.userShampooCount(user1.address);
      expect(count).to.equal(1);
    });

    it("Should emit ShampooRecorded event", async function () {
      const tx = await shampooTracker.connect(user1).recordShampoo();
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(shampooTracker, "ShampooRecorded")
        .withArgs(user1.address, block.timestamp);
    });

    it("Should allow multiple records from same user", async function () {
      // Record multiple times
      await shampooTracker.connect(user1).recordShampoo();
      await shampooTracker.connect(user1).recordShampoo();
      await shampooTracker.connect(user1).recordShampoo();

      // Check count
      const count = await shampooTracker.userShampooCount(user1.address);
      expect(count).to.equal(3);
    });

    it("Should track different users separately", async function () {
      // Record for different users
      await shampooTracker.connect(user1).recordShampoo();
      await shampooTracker.connect(user1).recordShampoo();
      await shampooTracker.connect(user2).recordShampoo();

      // Check counts
      const count1 = await shampooTracker.userShampooCount(user1.address);
      const count2 = await shampooTracker.userShampooCount(user2.address);
      
      expect(count1).to.equal(2);
      expect(count2).to.equal(1);
    });
  });

  describe("Get Shampoo History", function () {
    it("Should return empty array for user with no records", async function () {
      const history = await shampooTracker.getShampooHistory(user1.address);
      expect(history).to.have.lengthOf(0);
    });

    it("Should return correct history for user", async function () {
      // Record shampoo
      await shampooTracker.connect(user1).recordShampoo();
      
      // Get history
      const history = await shampooTracker.getShampooHistory(user1.address);
      
      expect(history).to.have.lengthOf(1);
      expect(history[0].user).to.equal(user1.address);
      expect(history[0].timestamp).to.be.greaterThan(0);
      expect(history[0].blockNumber).to.be.greaterThan(0);
    });

    it("Should return multiple records in correct order", async function () {
      // Record multiple times
      await shampooTracker.connect(user1).recordShampoo();
      await shampooTracker.connect(user1).recordShampoo();
      
      // Get history
      const history = await shampooTracker.getShampooHistory(user1.address);
      
      expect(history).to.have.lengthOf(2);
      expect(history[0].timestamp).to.be.lessThanOrEqual(history[1].timestamp);
    });
  });

  describe("Get Shampoo Count", function () {
    it("Should return 0 for user with no records", async function () {
      const count = await shampooTracker.getShampooCount(user1.address);
      expect(count).to.equal(0);
    });

    it("Should return correct count after records", async function () {
      await shampooTracker.connect(user1).recordShampoo();
      await shampooTracker.connect(user1).recordShampoo();
      
      const count = await shampooTracker.getShampooCount(user1.address);
      expect(count).to.equal(2);
    });
  });

  describe("Get Latest Shampoo", function () {
    it("Should revert for user with no records", async function () {
      await expect(shampooTracker.getLatestShampoo(user1.address))
        .to.be.revertedWith("No shampoo records found");
    });

    it("Should return latest record", async function () {
      // Record multiple times
      await shampooTracker.connect(user1).recordShampoo();
      await shampooTracker.connect(user1).recordShampoo();
      
      // Get latest
      const latest = await shampooTracker.getLatestShampoo(user1.address);
      
      expect(latest.user).to.equal(user1.address);
      expect(latest.timestamp).to.be.greaterThan(0);
      expect(latest.blockNumber).to.be.greaterThan(0);
    });
  });

  describe("Gas Usage", function () {
    it("Should use reasonable gas for recording shampoo", async function () {
      const tx = await shampooTracker.connect(user1).recordShampoo();
      const receipt = await tx.wait();
      
      // Gas should be less than 150,000 (reasonable for a simple operation)
      expect(receipt.gasUsed).to.be.lessThan(150000);
      console.log(`Gas used for recordShampoo: ${receipt.gasUsed}`);
    });
  });
});