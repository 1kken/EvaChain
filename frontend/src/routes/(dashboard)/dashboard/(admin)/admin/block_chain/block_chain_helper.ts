import { ethers, JsonRpcProvider, type Provider } from 'ethers';
import { PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS } from '$env/static/private';
import { type IPFSFileTracker, IPFSFileTracker__factory } from '$lib/type-chain/index';
import type { BigNumberish } from 'ethers';

// Define interface for the event data structure
export interface FileActionEvent {
	fileId: string;
	action: 'ADD_EVIDENCE' | 'UPDATE_EVIDENCE' | 'DELETE_EVIDENCE' | 'BACKUP';
	cid: string;
	fileType: 'DATA' | 'FILE';
	fileName: string;
	timestamp: BigNumberish;
	blockHash: string;
	transactionHash: string;
}

// The main log retrieval class
export class IPFSFileTrackerLogRetriever {
	private contract: IPFSFileTracker;
	private provider: Provider;

	constructor(
		contractAddress: string,
		provider: Provider,
		signerOrPrivateKey?: ethers.Wallet | string
	) {
		this.provider = provider;

		// If a signer is provided, use it; otherwise create a contract instance with just the provider
		if (signerOrPrivateKey) {
			let signer: ethers.Wallet;

			if (typeof signerOrPrivateKey === 'string') {
				// Create a wallet from private key if string was provided
				signer = new ethers.Wallet(signerOrPrivateKey, provider);
			} else {
				// Otherwise use the provided signer
				signer = signerOrPrivateKey;
			}

			this.contract = IPFSFileTracker__factory.connect(contractAddress, signer);
		} else {
			this.contract = IPFSFileTracker__factory.connect(contractAddress, provider);
		}
	}

	/**
	 * Get all FileActionRecorded events
	 * @param fromBlock The starting block to get logs from
	 * @param toBlock The ending block to get logs to (default: 'latest')
	 * @returns Array of parsed FileActionEvent objects
	 */
	async getAllFileActionLogs(
		fromBlock: number | string = 0,
		toBlock: number | string = 'latest'
	): Promise<FileActionEvent[]> {
		// Create filter for FileActionRecorded events
		const filter = this.contract.filters.FileActionRecorded();

		// Get all logs matching our filter
		const logs = await this.provider.getLogs({
			...filter,
			fromBlock,
			toBlock,
			address: CONTRACT_ADDRESS
		});

		// Parse the logs using the contract interface
		return logs.map((log) => {
			const parsedLog = this.contract.interface.parseLog(log);
			const { fileId, action, cid, fileType, fileName, timestamp, blockHash } = parsedLog!.args;

			return {
				fileId: fileId.toString(),
				action: this.getActionName(action),
				cid,
				fileType: this.getFileTypeName(fileType),
				fileName,
				timestamp,
				blockHash,
				transactionHash: log.transactionHash
			};
		});
	}

	/**
	 * Utility method to convert numeric action to string
	 */
	private getActionName(
		actionValue: number
	): 'ADD_EVIDENCE' | 'UPDATE_EVIDENCE' | 'DELETE_EVIDENCE' | 'BACKUP' {
		const actions = ['ADD_EVIDENCE', 'UPDATE_EVIDENCE', 'DELETE_EVIDENCE', 'BACKUP'];
		return actions[actionValue] as any;
	}

	/**
	 * Utility method to convert numeric file type to string
	 */
	private getFileTypeName(fileTypeValue: number): 'DATA' | 'FILE' {
		const fileTypes = ['DATA', 'FILE'];
		return fileTypes[fileTypeValue] as any;
	}
}
