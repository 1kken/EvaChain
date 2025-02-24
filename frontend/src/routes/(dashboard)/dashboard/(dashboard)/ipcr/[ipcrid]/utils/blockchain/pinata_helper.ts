import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PinataSDK, type UploadOptions, type UploadResponse } from 'pinata';
import { fetchIndicatorEvidenceById } from './utils';
import { PINATA_GATEWAY, PINATA_JWT } from '$env/static/private';
import { uploadFileDetailsToBlockChain } from './blockchain_helper';

const pinataEvidenceOptions: UploadOptions = {
	groupId: '0194cd06-03a1-7ea5-bbd5-847e65027455'
};

const pinata = new PinataSDK({
	pinataJwt: PINATA_JWT,
	pinataGateway: PINATA_GATEWAY
});

//action 0:add , 1:update, 2:delete
export async function processIpcrEvidence(
	supabase: SupabaseClient<Database>,
	accomplsihmentId: string,
	action: number
) {
	//fetch the IpcrIndicatorEvidence based on Id of indicator
	const evidence = await fetchIndicatorEvidenceById(supabase, accomplsihmentId);

	//download the evidence
	const { data: fileData, error: downloadError } = await supabase.storage
		.from('indicator_evidence')
		.download(evidence.file_path);

	if (downloadError) {
		throw new Error(`Error downloading file: ${downloadError.name}`);
	}

	const file = new File([fileData], evidence.file_path.split('/').pop() || 'evidence.file', {
		type: fileData.type
	});

	let pinataUpload: UploadResponse | null = null;
	try {
		pinataUpload = await pinata.upload.file(file, pinataEvidenceOptions);
		const fileDetails = {
			action: action,
			cid: pinataUpload.cid,
			fileType: 1, // Type for IPCR evidence
			fileName: file.name
		};

		const reason = await uploadFileDetailsToBlockChain(fileDetails);

		if (reason === null) {
			if (action === 2) {
			}
			return;
		}
		let actions = ['add evidence', 'update evidence', 'delete evidence'];

		const blockChainDetails = {
			action: actions[action],
			file_cid: reason.cid,
			file_name: reason.fileName,
			type: 'evidence',
			blockchain_hash: reason.currentBlockHash
		};

		const { error: insertError } = await supabase.from('blockchain_data').insert(blockChainDetails);

		if (insertError) {
			throw new Error(insertError.message);
		}
	} catch (error: any) {
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}
		console.error('here');
		throw new Error(`Error processing evidence ${evidence.id}: ${error}`);
	}
}
