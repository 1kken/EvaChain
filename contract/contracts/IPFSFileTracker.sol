// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IPFSFileTracker
 * @dev Contract for tracking IPFS file references with timestamps, file types, and names
 */
contract IPFSFileTracker {
    // Contract owner address
    address private immutable owner;

    // Enum to represent file types
    enum FileType {
        DATA,
        FILE
    }

    // Structure to store file information
    struct FileReference {
        string cid;
        FileType fileType;
        string fileName;
        uint256 timestamp;
        bytes32 blockHash;
        bool exists;
    }

    // Mapping to store file references by CID
    mapping(string => FileReference) private fileReferences;

    // Events
    event FileReferenceAdded(
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
    error FileReferenceAlreadyExists(string cid);
    error FileReferenceNotFound(string cid);

    /**
     * @dev Constructor to set the contract owner
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to restrict functions to contract owner
     */
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert UnauthorizedAccess(msg.sender);
        }
        _;
    }

    /**
     * @dev Add a new file reference
     * @param _cid IPFS Content Identifier
     * @param _fileType Type of the file (DATA or FILE)
     * @param _fileName Name of the file
     */
    function addFileReference(
        string memory _cid,
        FileType _fileType,
        string memory _fileName
    ) external onlyOwner {
        if (bytes(_cid).length == 0) {
            revert EmptyCID();
        }
        if (bytes(_fileName).length == 0) {
            revert EmptyFileName();
        }
        if (fileReferences[_cid].exists) {
            revert FileReferenceAlreadyExists(_cid);
        }

        uint256 currentTimestamp = block.timestamp;
        bytes32 currentBlockHash = blockhash(block.number - 1);

        fileReferences[_cid] = FileReference({
            cid: _cid,
            fileType: _fileType,
            fileName: _fileName,
            timestamp: currentTimestamp,
            blockHash: currentBlockHash,
            exists: true
        });

        emit FileReferenceAdded(
            _cid,
            _fileType,
            _fileName,
            currentTimestamp,
            currentBlockHash
        );
    }

    /**
     * @dev Get file reference details
     * @param _cid IPFS Content Identifier
     * @return Complete FileReference struct
     */
    function getFileReference(
        string memory _cid
    ) external view onlyOwner returns (FileReference memory) {
        FileReference memory fileRef = fileReferences[_cid];
        if (!fileRef.exists) {
            revert FileReferenceNotFound(_cid);
        }
        return fileRef;
    }

    /**
     * @dev Get the owner address
     * @return address The owner's address
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
     * @dev Check if a file reference exists
     * @param _cid IPFS Content Identifier
     * @return bool Whether the file reference exists
     */
    function fileExists(string memory _cid) external view returns (bool) {
        return fileReferences[_cid].exists;
    }

    /**
     * @dev Get current block hash
     * @return bytes32 The hash of the previous block
     */
    function getCurrentBlockHash() external view returns (bytes32) {
        return blockhash(block.number - 1);
    }
}
