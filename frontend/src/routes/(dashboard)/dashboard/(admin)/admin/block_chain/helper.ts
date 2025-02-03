import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import type { BigNumberish } from 'ethers';
import { message } from 'sveltekit-superforms';

//fetching data
export async function fetchBlockChainData(supabase: SupabaseClient<Database>) {
	let { data, error: errorFetch } = await supabase.from('blockchain_data').select('*');

	if (errorFetch) {
		throw new Error(errorFetch.message);
	}

	return data ?? [];
}

export async function fetchLatestBlockchainData(supabase: SupabaseClient<Database>) {
	let { data, error: errorFetch } = await supabase
		.from('blockchain_data')
		.select('created_at')
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (errorFetch) {
		if (errorFetch.code === 'PGRST116') {
			return null;
		}
		throw new Error(errorFetch.message);
	}

	return data;
}

//fetching bacjup data CSV

export async function fetchIpcrBackUpData(supabase: SupabaseClient<Database>) {
	let { data, error: errorFetch } = await supabase.from('ipcr_backup_view').select('*').csv();

	if (errorFetch) {
		throw new Error(errorFetch.message);
	}

	return data;
}

interface BlockChainDetails {
	file_cid: string;
	file_name: string;
	type: string;
	blockchain_hash: string;
}

export async function insertBlockChainData(
	supabase: SupabaseClient<Database>,
	data: BlockChainDetails
) {
	let { error: errorInsert } = await supabase.from('blockchain_data').insert({ ...data });

	if (errorInsert) {
		throw new Error(errorInsert.message);
	}
}
