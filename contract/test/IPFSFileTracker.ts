import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("IPFSFileTracker", function () {
  // We define a fixture to reuse the same setup in every test
  async function deployIPFSTrackerFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const IPFSFileTracker = await hre.ethers.getContractFactory(
      "IPFSFileTracker"
    );
    const ipfsTracker = await IPFSFileTracker.deploy();

    return { ipfsTracker, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { ipfsTracker, owner } = await loadFixture(
        deployIPFSTrackerFixture
      );
      expect(await ipfsTracker.getOwner()).to.equal(owner.address);
    });
  });

  describe("Access Control", function () {
    const testCID = "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy";
    const testFileName = "test.txt";
    const fileType = 1; // FILE type

    it("Should allow owner to add file reference", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.addFileReference(testCID, fileType, testFileName)
      )
        .to.emit(ipfsTracker, "FileReferenceAdded")
        .withArgs(testCID, fileType, testFileName, anyValue, anyValue); // Accept any timestamp value
    });

    it("Should revert when non-owner tries to add file reference", async function () {
      const { ipfsTracker, otherAccount } = await loadFixture(
        deployIPFSTrackerFixture
      );

      await expect(
        ipfsTracker
          .connect(otherAccount)
          .addFileReference(testCID, fileType, testFileName)
      ).to.be.revertedWithCustomError(ipfsTracker, "UnauthorizedAccess");
    });

    it("Should allow owner to get file reference", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await ipfsTracker.addFileReference(testCID, fileType, testFileName);
      const fileRef = await ipfsTracker.getFileReference(testCID);

      expect(fileRef.cid).to.equal(testCID);
      expect(fileRef.fileType).to.equal(fileType);
      expect(fileRef.fileName).to.equal(testFileName);
      expect(fileRef.exists).to.be.true;
    });

    it("Should revert when non-owner tries to get file reference", async function () {
      const { ipfsTracker, otherAccount } = await loadFixture(
        deployIPFSTrackerFixture
      );

      await ipfsTracker.addFileReference(testCID, fileType, testFileName);
      await expect(
        ipfsTracker.connect(otherAccount).getFileReference(testCID)
      ).to.be.revertedWithCustomError(ipfsTracker, "UnauthorizedAccess");
    });
  });

  describe("File Reference Management", function () {
    const testCID = "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy";
    const testFileName = "test.txt";
    const emptyCID = "";
    const emptyFileName = "";
    const fileType = 1; // FILE type
    const dataType = 0; // DATA type

    it("Should revert when adding empty CID", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.addFileReference(emptyCID, fileType, testFileName)
      ).to.be.revertedWithCustomError(ipfsTracker, "EmptyCID");
    });

    it("Should revert when adding empty file name", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.addFileReference(testCID, fileType, emptyFileName)
      ).to.be.revertedWithCustomError(ipfsTracker, "EmptyFileName");
    });

    it("Should revert when adding duplicate CID", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await ipfsTracker.addFileReference(testCID, fileType, testFileName);
      await expect(
        ipfsTracker.addFileReference(testCID, fileType, testFileName)
      ).to.be.revertedWithCustomError(
        ipfsTracker,
        "FileReferenceAlreadyExists"
      );
    });

    it("Should revert when getting non-existent file reference", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.getFileReference(testCID)
      ).to.be.revertedWithCustomError(ipfsTracker, "FileReferenceNotFound");
    });

    it("Should handle both DATA and FILE types correctly", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);
      const dataCID = "QmDataCID";
      const fileCID = "QmFileCID";
      const dataFileName = "data.json";
      const fileFileName = "document.pdf";

      await ipfsTracker.addFileReference(dataCID, dataType, dataFileName);
      await ipfsTracker.addFileReference(fileCID, fileType, fileFileName);

      const dataRef = await ipfsTracker.getFileReference(dataCID);
      const fileRef = await ipfsTracker.getFileReference(fileCID);

      expect(dataRef.fileType).to.equal(dataType);
      expect(fileRef.fileType).to.equal(fileType);
    });
  });

  describe("Events", function () {
    const testCID = "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy";
    const testFileName = "test.txt";
    const fileType = 1; // FILE type

    it("Should emit FileReferenceAdded event with correct parameters", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.addFileReference(testCID, fileType, testFileName)
      )
        .to.emit(ipfsTracker, "FileReferenceAdded")
        .withArgs(testCID, fileType, testFileName, anyValue, anyValue); // Accept any timestamp value
    });
  });

  describe("File Existence Check", function () {
    const testCID = "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy";
    const testFileName = "test.txt";
    const fileType = 1; // FILE type

    it("Should correctly report file existence", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      expect(await ipfsTracker.fileExists(testCID)).to.be.false;

      await ipfsTracker.addFileReference(testCID, fileType, testFileName);

      expect(await ipfsTracker.fileExists(testCID)).to.be.true;
    });
  });
});
