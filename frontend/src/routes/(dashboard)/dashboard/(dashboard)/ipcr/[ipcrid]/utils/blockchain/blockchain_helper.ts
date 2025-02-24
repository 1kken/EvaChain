import { PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS } from '$env/static/private';
import { IPFSFileTracker__factory } from '$lib/type-chain/index';
import { ethers, JsonRpcProvider } from 'ethers';
import type { BigNumberish } from 'ethers';

// 1. Initialize Provider
const provider: JsonRpcProvider = new JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = IPFSFileTracker__factory.connect(CONTRACT_ADDRESS, wallet);

interface FileDetails {
	action: BigNumberish;
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

export async function uploadFileDetailsToBlockChain(
	fileDetails: FileDetails
): Promise<FileReferenceAddedEvent | null> {
	console.log(fileDetails);
	try {
		const tx = await contract.recordFileAction(
			fileDetails.cid,
			fileDetails.action,
			fileDetails.fileType,
			fileDetails.fileName
		);

		const eventPromise = new Promise((resolve) => {
			contract.once(
				contract.filters['FileActionRecorded(bytes32,uint8,string,uint8,string,uint256,bytes32)'],
				(
					fileId: string,
					action: bigint,
					cid: string,
					fileType: bigint,
					fileName: string,
					timeStamp: bigint,
					blockHash: string
				) => {
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
		console.error(error);
		if (error instanceof Error && 'data' in error) {
			const errorData = error.data as string;

			try {
				const parsedError = contract.interface.parseError(errorData);

				switch (parsedError?.name) {
					case 'UnauthorizedAccess':
						const [caller] = parsedError.args;
						console.error(`UnauthorizedAccess: ${caller} is not the owner`);
						throw new Error(`UnauthorizedAccess: ${caller} is not the owner`);

					case 'EmptyCID':
						console.error('EmptyCID: CID cannot be empty');
						throw new Error('EmptyCID: CID cannot be empty');

					case 'EmptyFileName':
						console.error('EmptyFileName: Filename cannot be empty');
						throw new Error('EmptyFileName: Filename cannot be empty');

					case 'FileReferenceAlreadyExists':
						const [cid] = parsedError.args;
						console.error(`FileReferenceAlreadyExists: ${cid} already exists`);
						throw new Error(`FileReferenceAlreadyExists: ${cid} already exists`);

					case 'FileReferenceNotFound':
						const [missingCid] = parsedError.args;
						console.error(`FileReferenceNotFound: ${missingCid} not found`);
						throw new Error(`FileReferenceNotFound: ${missingCid} not found`);

					default:
						console.error('Unknown contract error:', parsedError);
						throw new Error(`Unknown contract error: ${parsedError?.name}`);
				}
			} catch (parseError) {
				console.error('Failed to parse error:', parseError);
				throw parseError;
			}
		} else {
			console.error('Non-contract error:', error);
			throw error;
		}
	}
}
