// Server endpoint
import { json, type RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const accomplishmentId = url.searchParams.get('accomplishment_id');

		if (!accomplishmentId) {
			return json({ error: 'Accomplishment ID is required' }, { status: 400 });
		}

		const { data: evidence, error: evidenceError } = await supabase
			.from('ipcr_indicator_evidence')
			.select('id, file_path')
			.eq('ipcr_indicator_accomplishment_id', accomplishmentId)
			.single();

		if (evidenceError?.code === 'PGRST116') {
			return json({ data: { signedUrl: '' } });
		}

		if (evidenceError) {
			console.error('Database error:', evidenceError);
			return json({ error: 'Failed to fetch evidence record' }, { status: 500 });
		}

		const { data: signedUrlData, error: signedUrlError } = await supabase.storage
			.from('indicator_evidence')
			.createSignedUrl(evidence.file_path, 60 * 60);

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
