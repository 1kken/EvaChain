import type { PageServerLoad } from './$types';
import { PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS } from '$env/static/private';
import { ethers, JsonRpcProvider } from 'ethers';
import { IPFSFileTrackerLogRetriever } from './block_chain_helper';

interface BlockChainData {
	file_cid: string;
	file_name: string;
	type: string;
	blockchain_hash: string;
	action: string;
	created_at: string;
}
export const load = (async ({ locals: { supabase } }) => {
	const provider: JsonRpcProvider = new JsonRpcProvider(RPC_URL);
	const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

	const logRetriever = new IPFSFileTrackerLogRetriever(CONTRACT_ADDRESS, provider, wallet);

	return {
		streamed: {
			blockChainData: logRetriever.getAllFileActionLogs()
		}
	};
}) satisfies PageServerLoad;
