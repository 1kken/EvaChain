import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchIpcrBackUpData } from './helper';
import type { PinataSDK, UploadOptions, UploadResponse } from 'pinata';
import { uploadFileDetailsToBlockChain } from './blockchain-helper';
const pinataCSVOptions: UploadOptions = {
	groupId: '0194ccf0-2f4b-7b4b-b899-53414ee9cbc5'
};
export async function backUpIpcr(supabase: SupabaseClient<Database>, pinata: PinataSDK) {
	const data = await fetchIpcrBackUpData(supabase);
	if (!data) {
		throw new Error('No data found In IPCR');
	}

	const file = new File([data], `ipcr_backup_${Date.now()}.csv`, { type: 'text/csv' });

	let pinataUpload: UploadResponse | null = null;

	try {
		// Upload to Pinata
		pinataUpload = await pinata.upload.file(file, pinataCSVOptions);

		// Upload to blockchain
		const fileDetails = {
			cid: pinataUpload.cid,
			fileType: 1,
			fileName: file.name
		};

		await uploadFileDetailsToBlockChain(fileDetails);
		return pinataUpload;
	} catch (error) {
		// If we have a Pinata upload and blockchain fails, delete from Pinata
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}
		throw error;
	}
}
