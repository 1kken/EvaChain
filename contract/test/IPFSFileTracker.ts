import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("IPFSFileTracker", function () {
  async function deployIPFSTrackerFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const IPFSFileTracker = await hre.ethers.getContractFactory(
      "IPFSFileTracker"
    );
    const ipfsTracker = await IPFSFileTracker.deploy();

    return { ipfsTracker, owner, otherAccount };
  }

  const Action = {
    ADD_EVIDENCE: 0,
    UPDATE_EVIDENCE: 1,
    DELETE_EVIDENCE: 2,
    BACKUP: 3,
  } as const;

  const FileType = {
    DATA: 0,
    FILE: 1,
  } as const;

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

    it("Should allow owner to record file action", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.ADD_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      )
        .to.emit(ipfsTracker, "FileActionRecorded")
        .withArgs(
          anyValue, // fileId
          Action.ADD_EVIDENCE,
          testCID,
          FileType.FILE,
          testFileName,
          anyValue, // timestamp
          anyValue // blockHash
        );
    });

    it("Should revert when non-owner tries to record file action", async function () {
      const { ipfsTracker, otherAccount } = await loadFixture(
        deployIPFSTrackerFixture
      );

      await expect(
        ipfsTracker
          .connect(otherAccount)
          .recordFileAction(
            testCID,
            Action.ADD_EVIDENCE,
            FileType.FILE,
            testFileName
          )
      )
        .to.be.revertedWithCustomError(ipfsTracker, "UnauthorizedAccess")
        .withArgs(otherAccount.address);
    });
  });

  describe("File Reference Management", function () {
    const testCID = "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy";
    const testFileName = "test.txt";
    const emptyCID = "";
    const emptyFileName = "";

    it("Should revert when adding empty CID", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.recordFileAction(
          emptyCID,
          Action.ADD_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      ).to.be.revertedWithCustomError(ipfsTracker, "EmptyCID");
    });

    it("Should revert when adding empty file name", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.ADD_EVIDENCE,
          FileType.FILE,
          emptyFileName
        )
      ).to.be.revertedWithCustomError(ipfsTracker, "EmptyFileName");
    });

    it("Should allow multiple actions on the same CID", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      // Add initial file
      const addTx = await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );
      const addReceipt = await addTx.wait();
      const addEvent = addReceipt?.logs[0];
      const initialFileId = addEvent?.args?.[0];

      // Update the same file
      const updateTx = await ipfsTracker.recordFileAction(
        testCID,
        Action.UPDATE_EVIDENCE,
        FileType.FILE,
        "updated.txt"
      );
      const updateReceipt = await updateTx.wait();
      const updateEvent = updateReceipt?.logs[0];
      const updatedFileId = updateEvent?.args?.[0];

      // Check that the fileIds are different
      expect(initialFileId).to.not.equal(updatedFileId);

      // Get latest reference
      const latestRef = await ipfsTracker.getLatestFileReference(testCID);
      expect(latestRef.fileName).to.equal("updated.txt");
    });

    it("Should handle deletion correctly", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      // Add file
      await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );

      // Delete file
      await ipfsTracker.recordFileAction(
        testCID,
        Action.DELETE_EVIDENCE,
        FileType.FILE,
        testFileName
      );

      // Check deletion status
      expect(await ipfsTracker.isFileDeleted(testCID)).to.be.true;

      // Attempt to add new action after deletion
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.UPDATE_EVIDENCE,
          FileType.FILE,
          "new.txt"
        )
      ).to.be.revertedWithCustomError(ipfsTracker, "FileAlreadyDeleted");
    });

    it("Should get latest file reference", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );

      const latestRef = await ipfsTracker.getLatestFileReference(testCID);
      expect(latestRef.cid).to.equal(testCID);
      expect(latestRef.action).to.equal(Action.ADD_EVIDENCE);
      expect(latestRef.fileType).to.equal(FileType.FILE);
      expect(latestRef.fileName).to.equal(testFileName);
      expect(latestRef.exists).to.be.true;
      expect(latestRef.isDeleted).to.be.false;
    });

    it("Should revert when getting non-existent file reference", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.getLatestFileReference(testCID)
      ).to.be.revertedWithCustomError(ipfsTracker, "FileNotFound");
    });

    it("Should revert when checking deletion status of non-existent file", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);
      const nonExistentCID = "QmNonExistentCID";

      await expect(
        ipfsTracker.isFileDeleted(nonExistentCID)
      ).to.be.revertedWithCustomError(ipfsTracker, "FileNotFound");
    });

    it("Should revert when getting non-existent file reference by fileId", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);
      const nonExistentFileId = ethers.randomBytes(32);

      await expect(
        ipfsTracker.getFileReference(nonExistentFileId)
      ).to.be.revertedWithCustomError(ipfsTracker, "FileNotFound");
    });

    it("Should get file reference by fileId", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      const tx = await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );
      const receipt = await tx.wait();
      const fileId = receipt.logs[0].args[0];

      const fileRef = await ipfsTracker.getFileReference(fileId);
      expect(fileRef.fileId).to.equal(fileId);
      expect(fileRef.blockHash).to.not.equal(ethers.ZeroHash);
    });

    it("Should allow new action when file exists but isn't deleted", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );

      // This should succeed since file exists but isn't deleted
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.UPDATE_EVIDENCE,
          FileType.FILE,
          "updated.txt"
        )
      ).to.not.be.reverted;
    });
  });

  describe("Events", function () {
    const testCID = "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy";
    const testFileName = "test.txt";

    it("Should emit FileActionRecorded event with correct parameters", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.ADD_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      )
        .to.emit(ipfsTracker, "FileActionRecorded")
        .withArgs(
          anyValue, // fileId
          Action.ADD_EVIDENCE,
          testCID,
          FileType.FILE,
          testFileName,
          anyValue, // timestamp
          anyValue // blockHash
        );
    });
  });
});
