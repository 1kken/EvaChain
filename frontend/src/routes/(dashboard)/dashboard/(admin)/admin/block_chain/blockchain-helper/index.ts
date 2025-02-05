import { IPFSFileTracker__factory } from './type-chain/index';
import { PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS } from '$env/static/private';
import { ethers, JsonRpcProvider } from 'ethers';
import type { BigNumberish } from 'ethers';

// 1. Initialize Provider
const provider: JsonRpcProvider = new JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = IPFSFileTracker__factory.connect(CONTRACT_ADDRESS, wallet);

interface FileDetails {
	cid: string;
	fileType: BigNumberish;
	fileName: string;
}

interface FileReferenceAddedEvent {
	cid: string;
	fileType: BigNumberish;
	fileName: string;
	currentTimeStamp: BigNumberish;
	currentBlockHash: string;
}
export async function uploadFileDetailsToBlockChain(fileDetails: FileDetails) {
	try {
		const exists = await contract.fileExists(fileDetails.cid);
		if (exists) {
			return null;
		}

		const tx = await contract.addFileReference(
			fileDetails.cid,
			fileDetails.fileType,
			fileDetails.fileName
		);

		const eventPromise = new Promise((resolve) => {
			contract.once(
				contract.filters['FileReferenceAdded(string,uint8,string,uint256,bytes32)'],
				// These are the actual parameters passed by the event
				(cid: string, fileType: bigint, fileName: string, timeStamp: bigint, blockHash: string) => {
					resolve({
						cid,
						fileType,
						fileName,
						currentTimeStamp: timeStamp,
						currentBlockHash: blockHash
					});
				}
			);
		});
		// Wait for transaction confirmation
		await tx.wait();

		// Wait for and return the event data
		const eventData = await eventPromise;
		return eventData as FileReferenceAddedEvent;
	} catch (error: any) {
		throw new Error('Unknown Error');
	}
}
