import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

//fetching data
export async function fetchBlockChainData(supabase: SupabaseClient<Database>) {
	let { data, error: errorFetch } = await supabase.from('blockchain_data').select('*');

	if (errorFetch) {
		throw new Error(errorFetch.message);
	}

	return data ?? [];
}

export async function fetchIpcrIndicatorEvidence(
	supabase: SupabaseClient<Database>,
	lastBackupDate?: string
) {
	if (lastBackupDate === undefined) {
		let { data, error: errorFetch } = await supabase.from('ipcr_indicator_evidence').select('*');
		if (errorFetch) {
			throw new Error(errorFetch.message);
		}

		return data;
	}

	let { data, error: errorFetch } = await supabase
		.from('ipcr_indicator_evidence')
		.select('*')
		.or(`created_at.gt.${lastBackupDate},updated_at.gt.${lastBackupDate}`);
	if (errorFetch) {
		throw new Error(errorFetch.message);
	}

	return data ?? null;
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

//fetching backup data CSV

type BackupViewName =
	| 'ipcr_backup_view'
	| 'operational_backup_view'
	| 'dpcr_backup_view'
	| 'opcr_backup_view'
	| 'strategic_plan_backup_view'
	| 'accomplishment_report_backup_view';

async function fetchBackupData(
	supabase: SupabaseClient<Database>,
	viewName: BackupViewName,
	lastBackupDate?: string
) {
	// Ensure lastBackupDate is valid
	const backupDate = lastBackupDate || '1970-01-01T00:00:00Z';

	// First, check if there are new records
	const countQuery = supabase
		.from(viewName)
		.select('*', { count: 'exact', head: true })
		.or(`created_at.gt.${backupDate},updated_at.gt.${backupDate}`);

	const { count, error: countError } = await countQuery;

	if (countError) {
		throw new Error(`Error counting ${viewName}: ${countError.message}`);
	}

	// If no new data, return early
	if (!count || count === 0) {
		return null; // or return [] depending on your needs
	}

	// Fetch actual data in CSV format
	const { data, error: fetchError } = await supabase
		.from(viewName)
		.select('*')
		.or(`created_at.gt.${backupDate},updated_at.gt.${backupDate}`)
		.csv(); // Keep .csv() now that we fixed the query

	if (fetchError) {
		throw new Error(`Error fetching ${viewName}: ${fetchError.message}`);
	}

	return data;
}

export async function fetchIpcrBackUpData(
	supabase: SupabaseClient<Database>,
	lastBackupDate?: string
) {
	return fetchBackupData(supabase, 'ipcr_backup_view', lastBackupDate);
}

export async function fetchOperationalPlanBackUpData(
	supabase: SupabaseClient<Database>,
	lastBackupDate?: string
) {
	return fetchBackupData(supabase, 'operational_backup_view', lastBackupDate);
}

export async function fetchDpcrBackUpData(
	supabase: SupabaseClient<Database>,
	lastBackupDate?: string
) {
	return fetchBackupData(supabase, 'dpcr_backup_view', lastBackupDate);
}

export async function fetchOpcrBackUpData(
	supabase: SupabaseClient<Database>,
	lastBackupDate?: string
) {
	return fetchBackupData(supabase, 'opcr_backup_view', lastBackupDate);
}

export async function fetchStrategicPlanBackUpData(
	supabase: SupabaseClient<Database>,
	lastBackupDate?: string
) {
	return fetchBackupData(supabase, 'strategic_plan_backup_view', lastBackupDate);
}

export async function fetchAccomplishmentReportBackUpData(
	supabase: SupabaseClient<Database>,
	lastBackupDate?: string
) {
	return fetchBackupData(supabase, 'accomplishment_report_backup_view', lastBackupDate);
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
