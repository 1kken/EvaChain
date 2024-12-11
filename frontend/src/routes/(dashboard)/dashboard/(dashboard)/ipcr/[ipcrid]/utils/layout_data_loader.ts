// src/lib/utils/supabase-queries.ts
import { error } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '$lib/types/database.types';

type SupabaseQueryOptions = {
	errorMessage?: string;
	transform?: (data: any) => any;
};

export async function safeQuery<T>(
	supabase: SupabaseClient<Database>,
	queryFn: (client: SupabaseClient<Database>) => any,
	options: SupabaseQueryOptions = {}
): Promise<T> {
	const { errorMessage = 'Database query failed', transform } = options;

	try {
		const { data, error: queryError } = await queryFn(supabase);

		if (queryError) {
			console.error(`Query error:`, queryError);
			throw error(500, errorMessage);
		}

		if (!data) {
			throw error(404, 'No data found');
		}

		return transform ? transform(data) : data;
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
			throw err; // Re-throw SvelteKit errors
		}
		console.error('Unexpected query error:', err);
		throw error(500, errorMessage);
	}
}

export async function getIPCR(supabase: SupabaseClient<Database>, ipcrId: string) {
	return safeQuery<Tables<'ipcr'>>(
		supabase,
		(client) => client.from('ipcr').select().eq('id', ipcrId).single(),
		{
			errorMessage: 'Failed to fetch IPCR data'
		}
	);
}

export async function getCoreFunctions(supabase: SupabaseClient<Database>, ipcrId: string) {
	return safeQuery<Tables<'core_function'>[]>(
		supabase,
		(client) => client.from('core_function').select().eq('ipcr_id', ipcrId).order('position'),
		{ errorMessage: 'Failed to fetch core functions' }
	);
}

export async function getSupportFunctions(supabase: SupabaseClient<Database>, ipcrId: string) {
	return safeQuery<Tables<'support_function'>[]>(
		supabase,
		(client) => client.from('support_function').select().eq('ipcr_id', ipcrId).order('position'),
		{ errorMessage: 'Failed to fetch support functions' }
	);
}
