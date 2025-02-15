import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	fetchAccomplishmentReportBackUpData,
	fetchDpcrBackUpData,
	fetchIpcrBackUpData,
	fetchOpcrBackUpData,
	fetchOperationalPlanBackUpData,
	fetchStrategicPlanBackUpData
} from './helper';
import type { PinataSDK, UploadOptions, UploadResponse } from 'pinata';
import { uploadFileDetailsToBlockChain } from './blockchain_helper';

const pinataCSVOptions: UploadOptions = {
	groupId: '0194ccf0-2f4b-7b4b-b899-53414ee9cbc5'
};

export async function backUpIpcr(
	supabase: SupabaseClient<Database>,
	pinata: PinataSDK,
	latestBackupDate?: string
) {
	const data = await fetchIpcrBackUpData(supabase, latestBackupDate);
	if (!data) {
		return `No data to be backed up found in IPCR`;
	}

	const file = new File([data], `ipcr_backup_${Date.now()}.csv`, { type: 'text/csv' });

	let pinataUpload: UploadResponse | null = null;

	try {
		// Upload to Pinata
		pinataUpload = await pinata.upload.file(file, pinataCSVOptions);

		// Upload to blockchain
		const fileDetails = {
			cid: pinataUpload.cid,
			fileType: 0,
			fileName: file.name
		};

		//Upload to block chain if existent it will return null if not it will return from fileReferenceAdded containing
		//cid, fileType, fileName, currentTimeStamp, currentBlockHash
		const reason = await uploadFileDetailsToBlockChain(fileDetails);
		if (reason === null) {
			return `File already exists in block chain ${fileDetails.fileName}`;
		}

		//upload to supabase
		const blockChainDetails = {
			file_cid: reason.cid,
			file_name: reason.fileName,
			type: 'data',
			blockchain_hash: reason.currentBlockHash
		};

		const { data, error } = await supabase.from('blockchain_data').insert(blockChainDetails);

		if (error) {
			throw new Error(error.message);
		}
	} catch (error: any) {
		// If we have a Pinata upload and blockchain fails, delete from Pinata
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}

		throw new Error(`Error uploading/or blockchain${error.message}`);
	}
}
export async function backUpOperationalPlan(
	supabase: SupabaseClient<Database>,
	pinata: PinataSDK,
	lastBackupDate?: string
) {
	const data = await fetchOperationalPlanBackUpData(supabase, lastBackupDate);
	if (!data) {
		return `No data to be backed up found in Operational Plan`;
	}

	const file = new File([data], `operational_plan_backup_${Date.now()}.csv`, { type: 'text/csv' });

	let pinataUpload: UploadResponse | null = null;

	try {
		// Upload to Pinata
		pinataUpload = await pinata.upload.file(file, pinataCSVOptions);

		// Upload to blockchain
		const fileDetails = {
			cid: pinataUpload.cid,
			fileType: 0,
			fileName: file.name
		};

		const reason = await uploadFileDetailsToBlockChain(fileDetails);
		if (reason === null) {
			return `File already exists in blockchain ${fileDetails.fileName}`;
		}

		// Upload to Supabase
		const blockChainDetails = {
			file_cid: reason.cid,
			file_name: reason.fileName,
			type: 'data',
			blockchain_hash: reason.currentBlockHash
		};

		const { data, error } = await supabase.from('blockchain_data').insert(blockChainDetails);

		if (error) {
			throw new Error(error.message);
		}
	} catch (error: any) {
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}
		throw new Error(`Error uploading/or blockchain: ${error.message}`);
	}
}

export async function backUpDpcr(
	supabase: SupabaseClient<Database>,
	pinata: PinataSDK,
	latestBackupDate?: string
) {
	const data = await fetchDpcrBackUpData(supabase, latestBackupDate);
	if (!data) {
		return `No data to be backed up found in DPCR`;
	}

	const file = new File([data], `dpcr_backup_${Date.now()}.csv`, { type: 'text/csv' });

	let pinataUpload: UploadResponse | null = null;

	try {
		pinataUpload = await pinata.upload.file(file, pinataCSVOptions);

		const fileDetails = {
			cid: pinataUpload.cid,
			fileType: 0,
			fileName: file.name
		};

		const reason = await uploadFileDetailsToBlockChain(fileDetails);
		if (reason === null) {
			return `File already exists in blockchain ${fileDetails.fileName}`;
		}

		const blockChainDetails = {
			file_cid: reason.cid,
			file_name: reason.fileName,
			type: 'data',
			blockchain_hash: reason.currentBlockHash
		};

		const { data, error } = await supabase.from('blockchain_data').insert(blockChainDetails);

		if (error) {
			throw new Error(error.message);
		}
	} catch (error: any) {
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}
		throw new Error(`Error uploading/or blockchain: ${error.message}`);
	}
}

export async function backUpOpcr(
	supabase: SupabaseClient<Database>,
	pinata: PinataSDK,
	lastBackupDate?: string
) {
	const data = await fetchOpcrBackUpData(supabase, lastBackupDate);
	if (!data) {
		return `No data to be backed up found in OPCR`;
	}

	const file = new File([data], `opcr_backup_${Date.now()}.csv`, { type: 'text/csv' });

	let pinataUpload: UploadResponse | null = null;

	try {
		pinataUpload = await pinata.upload.file(file, pinataCSVOptions);

		const fileDetails = {
			cid: pinataUpload.cid,
			fileType: 0,
			fileName: file.name
		};

		const reason = await uploadFileDetailsToBlockChain(fileDetails);
		if (reason === null) {
			return `File already exists in blockchain ${fileDetails.fileName}`;
		}

		const blockChainDetails = {
			file_cid: reason.cid,
			file_name: reason.fileName,
			type: 'data',
			blockchain_hash: reason.currentBlockHash
		};

		const { data, error } = await supabase.from('blockchain_data').insert(blockChainDetails);

		if (error) {
			throw new Error(error.message);
		}
	} catch (error: any) {
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}
		throw new Error(`Error uploading/or blockchain: ${error.message}`);
	}
}

export async function backUpStrategicPlan(
	supabase: SupabaseClient<Database>,
	pinata: PinataSDK,
	lastBackupDate?: string
) {
	const data = await fetchStrategicPlanBackUpData(supabase, lastBackupDate);
	if (!data) {
		return `No data to be backed up found in Strategic Plan`;
	}

	const file = new File([data], `strategic_plan_backup_${Date.now()}.csv`, { type: 'text/csv' });

	let pinataUpload: UploadResponse | null = null;

	try {
		pinataUpload = await pinata.upload.file(file, pinataCSVOptions);

		const fileDetails = {
			cid: pinataUpload.cid,
			fileType: 0,
			fileName: file.name
		};

		const reason = await uploadFileDetailsToBlockChain(fileDetails);
		if (reason === null) {
			return `File already exists in blockchain ${fileDetails.fileName}`;
		}

		const blockChainDetails = {
			file_cid: reason.cid,
			file_name: reason.fileName,
			type: 'data',
			blockchain_hash: reason.currentBlockHash
		};

		const { data, error } = await supabase.from('blockchain_data').insert(blockChainDetails);

		if (error) {
			throw new Error(error.message);
		}
	} catch (error: any) {
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}
		throw new Error(`Error uploading/or blockchain: ${error.message}`);
	}
}

export async function backUpAccomplishmentReport(
	supabase: SupabaseClient<Database>,
	pinata: PinataSDK,
	lastBackupDate?: string
) {
	const data = await fetchAccomplishmentReportBackUpData(supabase, lastBackupDate);
	if (!data) {
		return `No data to be backed up found in Accomplishment Report`;
	}

	const file = new File([data], `accomplishment_report_backup_${Date.now()}.csv`, {
		type: 'text/csv'
	});

	let pinataUpload: UploadResponse | null = null;

	try {
		pinataUpload = await pinata.upload.file(file, pinataCSVOptions);

		const fileDetails = {
			cid: pinataUpload.cid,
			fileType: 0,
			fileName: file.name
		};

		const reason = await uploadFileDetailsToBlockChain(fileDetails);
		if (reason === null) {
			return `File already exists in blockchain ${fileDetails.fileName}`;
		}

		const blockChainDetails = {
			file_cid: reason.cid,
			file_name: reason.fileName,
			type: 'data',
			blockchain_hash: reason.currentBlockHash
		};

		const { data, error } = await supabase.from('blockchain_data').insert(blockChainDetails);

		if (error) {
			throw new Error(error.message);
		}
	} catch (error: any) {
		if (pinataUpload?.cid) {
			await pinata.files.delete([pinataUpload.cid]);
		}
		throw new Error(`Error uploading/or blockchain: ${error.message}`);
	}
}
