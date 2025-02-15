import type { PageServerLoad } from './$types';

interface BlockChainData {
	file_cid: string;
	file_name: string;
	type: string;
	blockchain_hash: string;
	action: string;
	created_at: string;
}
export const load = (async ({ locals: { supabase } }) => {
	const { data: blockChainData, error: fetchError } = await supabase
		.from('blockchain_data')
		.select('file_cid,file_name,type,blockchain_hash,action,created_at')
		.returns<BlockChainData[]>();

	if (fetchError) {
		return {
			blockChainData: [] as BlockChainData[]
		};
	}

	return {
		blockChainData: blockChainData ?? []
	};
}) satisfies PageServerLoad;
