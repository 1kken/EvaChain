// Server endpoint
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const ipcrIndicatorId = url.searchParams.get('ipcr_indicator_id');

		if (!ipcrIndicatorId) {
			return json({ error: 'IPCR indicator ID is required' }, { status: 400 });
		}

		// First get the evidence record
		const { data: evidence, error: evidenceError } = await supabase
			.from('ipcr_indicator_evidence')
			.select('*')
			.eq('ipcr_indicator_id', ipcrIndicatorId)
			.limit(1)
			.single();

		if (evidenceError?.code === 'PGRST116') {
			// No evidence found - return empty string URL
			return json({ data: { signedUrl: '' } });
		}

		if (evidenceError) {
			console.error('Database error:', evidenceError);
			return json({ error: 'Failed to fetch evidence record' }, { status: 500 });
		}

		// Get the signed URL for the file
		const { data: signedUrlData, error: signedUrlError } = await supabase.storage
			.from('indicator_evidence')
			.createSignedUrl(evidence.file_path, 60 * 60); // 1 hour expiry

		if (signedUrlError) {
			console.error('Signed URL error:', signedUrlError);
			return json({ error: 'Failed to create signed URL' }, { status: 500 });
		}

		return json({ data: { signedUrl: signedUrlData.signedUrl } });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
