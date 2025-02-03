import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchBlockChainData, fetchIpcrBackUpData, fetchLatestBlockchainData } from './helper';
import { PinataSDK } from 'pinata';
import { PUBLIC_PINATA_JWT, PUBLIC_PINATA_GATEWAY } from '$env/static/public';
import { backUpIpcr } from './pinata_helper';
export const load = (async ({ locals: { supabase, session } }) => {
	const blockChainData = await fetchBlockChainData(supabase);
	const latestBlockChainData = await fetchLatestBlockchainData(supabase);
	return { blockChainData, latestBlockChainData };
}) satisfies PageServerLoad;

export const actions: Actions = {
	backupdata: async ({ locals: { supabase } }) => {
		const pinata = new PinataSDK({
			pinataJwt: PUBLIC_PINATA_JWT, // Use private key
			pinataGateway: PUBLIC_PINATA_GATEWAY
		});

		try {
			const result = await backUpIpcr(supabase, pinata);
		} catch (error: any) {
			return fail(500, { error: `Error Backing Up: ${error.message}` });
		}
	}
};
