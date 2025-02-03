import { IPFSFileTracker__factory } from './type-chain/index';
import { PUBLIC_CONTRACT_ADDRESS, PUBLIC_RPC_URL, PUBLIC_PRIVATE_KEY } from '$env/static/public';
import { ethers, JsonRpcProvider } from 'ethers';
import type { BigNumberish } from 'ethers';

// 1. Initialize Provider
const provider: JsonRpcProvider = new JsonRpcProvider(PUBLIC_RPC_URL);
const wallet = new ethers.Wallet(PUBLIC_PRIVATE_KEY, provider);
const contract = IPFSFileTracker__factory.connect(PUBLIC_CONTRACT_ADDRESS, wallet);

interface FileDetails {
	cid: string;
	fileType: BigNumberish;
	fileName: string;
}
export async function uploadFileDetailsToBlockChain(fileDetails: FileDetails) {
	const tx = await contract.addFileReference(
		fileDetails.cid,
		fileDetails.fileType,
		fileDetails.fileName
	);

	await tx.wait();
}
