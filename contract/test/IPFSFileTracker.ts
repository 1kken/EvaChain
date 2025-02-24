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

    it("Should revert when non-owner tries to get file reference", async function () {
      const { ipfsTracker, otherAccount } = await loadFixture(
        deployIPFSTrackerFixture
      );

      // First, add a file as owner
      const tx = await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );
      const receipt = await tx.wait();
      const fileId = receipt.logs[0].args[0];

      // Try to get the file reference as non-owner
      await expect(ipfsTracker.connect(otherAccount).getFileReference(fileId))
        .to.be.revertedWithCustomError(ipfsTracker, "UnauthorizedAccess")
        .withArgs(otherAccount.address);
    });

    it("Should revert when non-owner tries to get latest file reference", async function () {
      const { ipfsTracker, otherAccount } = await loadFixture(
        deployIPFSTrackerFixture
      );

      // First, add a file as owner
      await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );

      // Try to get the latest file reference as non-owner
      await expect(
        ipfsTracker.connect(otherAccount).getLatestFileReference(testCID)
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

    it("Should allow deletion operations to be recorded", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      // Add file
      await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );

      // Delete file operation still succeeds but doesn't prevent further actions
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.DELETE_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      ).to.not.be.reverted;

      // Should be able to perform new actions on the same CID after a delete operation
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.UPDATE_EVIDENCE,
          FileType.FILE,
          "new.txt"
        )
      ).to.not.be.reverted;
    });

    it("Should always allow new actions on existing CIDs", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      // Add initial file
      await ipfsTracker.recordFileAction(
        testCID,
        Action.ADD_EVIDENCE,
        FileType.FILE,
        testFileName
      );

      // Multiple updates should be allowed
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.UPDATE_EVIDENCE,
          FileType.FILE,
          "updated.txt"
        )
      ).to.not.be.reverted;

      // Even after updating, more updates should be allowed
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.UPDATE_EVIDENCE,
          FileType.FILE,
          "updated_again.txt"
        )
      ).to.not.be.reverted;

      // Deletion should be allowed
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.DELETE_EVIDENCE,
          FileType.FILE,
          "deleted.txt"
        )
      ).to.not.be.reverted;

      // Even after deletion, more updates should be allowed
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.UPDATE_EVIDENCE,
          FileType.FILE,
          "updated_after_deletion.txt"
        )
      ).to.not.be.reverted;
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
    });

    it("Should revert when getting non-existent file reference", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      await expect(
        ipfsTracker.getLatestFileReference(testCID)
      ).to.be.revertedWithCustomError(ipfsTracker, "FileNotFound");
    });

    it("Should handle special characters in CID and filename", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);
      const specialCID = "QmX!@#$%^&*()_+=";
      const specialFileName = "test-!@#$%^&*()_+=.txt";

      // This should work despite special characters
      await expect(
        ipfsTracker.recordFileAction(
          specialCID,
          Action.ADD_EVIDENCE,
          FileType.FILE,
          specialFileName
        )
      ).to.not.be.reverted;

      // Verify we can retrieve it
      const fileRef = await ipfsTracker.getLatestFileReference(specialCID);
      expect(fileRef.cid).to.equal(specialCID);
      expect(fileRef.fileName).to.equal(specialFileName);
    });

    it("Should revert when getting non-existent file reference by fileId", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);
      const nonExistentFileId = ethers.randomBytes(32);

      await expect(
        ipfsTracker.getFileReference(nonExistentFileId)
      ).to.be.revertedWithCustomError(ipfsTracker, "FileNotFound");
    });

    it("Should handle edge case with zero hash fileId", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);
      const zeroFileId = ethers.ZeroHash;

      await expect(
        ipfsTracker.getFileReference(zeroFileId)
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

    it("Should emit events for all action types", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      // Test ADD_EVIDENCE
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.ADD_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      ).to.emit(ipfsTracker, "FileActionRecorded");

      // Test UPDATE_EVIDENCE
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.UPDATE_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      ).to.emit(ipfsTracker, "FileActionRecorded");

      // Test DELETE_EVIDENCE
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.DELETE_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      ).to.emit(ipfsTracker, "FileActionRecorded");

      // Test BACKUP
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.BACKUP,
          FileType.FILE,
          testFileName
        )
      ).to.emit(ipfsTracker, "FileActionRecorded");
    });

    it("Should emit events for both file types", async function () {
      const { ipfsTracker } = await loadFixture(deployIPFSTrackerFixture);

      // Test FileType.FILE
      await expect(
        ipfsTracker.recordFileAction(
          testCID,
          Action.ADD_EVIDENCE,
          FileType.FILE,
          testFileName
        )
      ).to.emit(ipfsTracker, "FileActionRecorded");

      // Test FileType.DATA with a different CID
      const dataCID = "QmDataTypeTest";
      await expect(
        ipfsTracker.recordFileAction(
          dataCID,
          Action.ADD_EVIDENCE,
          FileType.DATA,
          "data.json"
        )
      ).to.emit(ipfsTracker, "FileActionRecorded");
    });
  });
});
