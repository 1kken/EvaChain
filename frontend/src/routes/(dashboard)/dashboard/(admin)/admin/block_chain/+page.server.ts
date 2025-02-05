import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchBlockChainData, fetchIpcrBackUpData, fetchLatestBlockchainData } from './helper';
import { PinataSDK } from 'pinata';
import { PINATA_JWT, PINATA_GATEWAY } from '$env/static/private';
import {
	backUpAccomplishmentReport,
	backUpDpcr,
	backUpIpcr,
	backupIpcrEvidence,
	backUpOpcr,
	backUpOperationalPlan,
	backUpStrategicPlan
} from './pinata_helper';
export const load = (async ({ locals: { supabase, session } }) => {
	const blockChainData = await fetchBlockChainData(supabase);
	const latestBlockChainData = await fetchLatestBlockchainData(supabase);
	return { blockChainData, latestBlockChainData };
}) satisfies PageServerLoad;

export const actions: Actions = {
	backupdata: async ({ locals: { supabase } }) => {
		const lastBackup = await fetchLatestBlockchainData(supabase);
		const pinata = new PinataSDK({
			pinataJwt: PINATA_JWT,
			pinataGateway: PINATA_GATEWAY
		});
		const errors: string[] = [];

		try {
			// Execute backup functions sequentially instead of in parallel
			const backupFunctions = [
				() => backUpIpcr(supabase, pinata, lastBackup?.created_at),
				() => backUpOperationalPlan(supabase, pinata, lastBackup?.created_at),
				() => backUpDpcr(supabase, pinata, lastBackup?.created_at),
				() => backUpOpcr(supabase, pinata, lastBackup?.created_at),
				() => backUpStrategicPlan(supabase, pinata, lastBackup?.created_at),
				() => backUpAccomplishmentReport(supabase, pinata, lastBackup?.created_at),
				() => backupIpcrEvidence(supabase, pinata, lastBackup?.created_at)
			];

			const results = [];
			for (const backupFn of backupFunctions) {
				results.push(await backupFn());
			}

			// Destructure results for error collection
			const [
				backupIpcrResult,
				backupOperationalPlanResult,
				backupDpcrResult,
				backupOpcrResult,
				backupStrategicPlanResult,
				backupAccomplishmentReportResult,
				backUpIpcrEvidenceResult
			] = results;

			// Collect any error messages from the results
			if (backupIpcrResult) errors.push(backupIpcrResult);
			if (backupOperationalPlanResult) errors.push(backupOperationalPlanResult);
			if (backupDpcrResult) errors.push(backupDpcrResult);
			if (backupOpcrResult) errors.push(backupOpcrResult);
			if (backupStrategicPlanResult) errors.push(backupStrategicPlanResult);
			if (backupAccomplishmentReportResult) errors.push(backupAccomplishmentReportResult);
			if (backUpIpcrEvidenceResult) errors.push(backUpIpcrEvidenceResult);

			// If there are any errors, return them as a 422 response
			if (errors.length > 0) {
				return fail(422, { message: errors.join('\n') });
			}

			// If everything succeeded, return a success message
			return { success: true, message: 'All backups completed successfully' };
		} catch (err: any) {
			console.error('Backup failed:', err);
			return error(500, { message: err.message });
		}
	},
	getfile: async ({ request }) => {
		const data = await request.formData();
		const file_cid = data.get('file_cid')?.toString();
		if (!file_cid) {
			return fail(422, { message: 'No file CID provided' });
		}
		const pinata = new PinataSDK({
			pinataJwt: PINATA_JWT,
			pinataGateway: PINATA_GATEWAY
		});

		const url = await pinata.gateways.createSignedURL({
			cid: file_cid,
			expires: 500000
		});

		redirect(302, url);
	}
};
