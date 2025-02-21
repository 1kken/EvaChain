// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IPFSFileTracker
 * @dev Contract for tracking IPFS file references with unique identifiers
 */
contract IPFSFileTracker {
    address private immutable owner;

    enum FileType {
        DATA,
        FILE
    }
    enum Action {
        ADD_EVIDENCE,
        UPDATE_EVIDENCE,
        DELETE_EVIDENCE,
        BACKUP
    }

    struct FileReference {
        bytes32 fileId; // Unique identifier for this specific file action
        string cid; // IPFS Content Identifier
        Action action; // Type of action performed
        FileType fileType; // Type of file
        string fileName; // Name of file
        uint256 timestamp; // When the action was performed
        bytes32 blockHash; // Block hash at time of action
        bool exists; // Whether this reference exists
        bool isDeleted; // Whether the file is marked as deleted
    }

    // Primary mapping using fileId as key
    mapping(bytes32 => FileReference) private fileReferences;

    // Mapping to track latest fileId for each CID
    mapping(string => bytes32) private latestFileIds;

    // Events
    event FileActionRecorded(
        bytes32 indexed fileId,
        Action action,
        string cid,
        FileType fileType,
        string fileName,
        uint256 timestamp,
        bytes32 blockHash
    );

    // Custom errors
    error UnauthorizedAccess(address caller);
    error EmptyCID();
    error EmptyFileName();
    error FileNotFound(string cid);
    error FileAlreadyDeleted(string cid);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert UnauthorizedAccess(msg.sender);
        }
        _;
    }

    /**
     * @dev Generate a unique fileId for each action
     */
    function generateFileId(
        string memory _cid,
        uint256 _timestamp,
        Action _action
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_cid, _timestamp, uint8(_action)));
    }

    /**
     * @dev Record a file action (add/update/delete)
     */
    function recordFileAction(
        string memory _cid,
        Action _action,
        FileType _fileType,
        string memory _fileName
    ) external onlyOwner {
        if (bytes(_cid).length == 0) revert EmptyCID();
        if (bytes(_fileName).length == 0) revert EmptyFileName();

        bytes32 lastFileId = latestFileIds[_cid];
        if (lastFileId != bytes32(0)) {
            FileReference storage lastRef = fileReferences[lastFileId];
            if (lastRef.isDeleted && _action != Action.DELETE_EVIDENCE) {
                revert FileAlreadyDeleted(_cid);
            }
        }

        uint256 currentTimestamp = block.timestamp;
        bytes32 currentBlockHash = blockhash(block.number - 1);
        bytes32 fileId = generateFileId(_cid, currentTimestamp, _action);

        fileReferences[fileId] = FileReference({
            fileId: fileId,
            cid: _cid,
            action: _action,
            fileType: _fileType,
            fileName: _fileName,
            timestamp: currentTimestamp,
            blockHash: currentBlockHash,
            exists: true,
            isDeleted: _action == Action.DELETE_EVIDENCE
        });

        latestFileIds[_cid] = fileId;

        emit FileActionRecorded(
            fileId,
            _action,
            _cid,
            _fileType,
            _fileName,
            currentTimestamp,
            currentBlockHash
        );
    }

    /**
     * @dev Get file reference by fileId
     */
    function getFileReference(
        bytes32 _fileId
    ) external view onlyOwner returns (FileReference memory) {
        FileReference memory fileRef = fileReferences[_fileId];
        if (!fileRef.exists) {
            revert FileNotFound(fileRef.cid);
        }
        return fileRef;
    }

    /**
     * @dev Get the latest file reference for a CID
     */
    function getLatestFileReference(
        string memory _cid
    ) external view onlyOwner returns (FileReference memory) {
        bytes32 fileId = latestFileIds[_cid];
        if (fileId == bytes32(0)) {
            revert FileNotFound(_cid);
        }
        return fileReferences[fileId];
    }

    /**
     * @dev Check if a file is currently marked as deleted
     */
    function isFileDeleted(string memory _cid) external view returns (bool) {
        bytes32 fileId = latestFileIds[_cid];
        if (fileId == bytes32(0)) {
            revert FileNotFound(_cid);
        }
        return fileReferences[fileId].isDeleted;
    }

    /**
     * @dev Get the owner address
     */
    function getOwner() external view returns (address) {
        return owner;
    }
}
