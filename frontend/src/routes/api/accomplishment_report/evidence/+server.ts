import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get accomplishment_indicator_id from URL parameter
		const accomplishmentIndicatorId = url.searchParams.get('accomplishment_indicator_id');

		if (!accomplishmentIndicatorId) {
			return json({ error: 'accomplishment_indicator_id is required' }, { status: 400 });
		}

		// Call RPC function to get evidence files grouped by user
		const { data, error } = await supabase.rpc('get_evidence_files_by_user', {
			p_accomplishment_indicator_id: accomplishmentIndicatorId
		});

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch evidence files' }, { status: 500 });
		}

		if (!data || data.length === 0) {
			return json({
				data: [],
				message: 'No evidence files found for this indicator'
			});
		}

		// Process each user's files to create a simplified response
		const simplifiedData = await Promise.all(
			data.map(async (item) => {
				const filesArray = Array.isArray(item.files) ? item.files : [item.files];

				// Create signed URLs for each file
				const signedUrls = await Promise.all(
					filesArray.map(async (filePath) => {
						const { data: signedUrlData, error: signError } = await supabase.storage
							.from('indicator_evidence')
							.createSignedUrl(filePath, 60 * 60); // 60 minutes expiry

						if (signError) {
							console.error(`Error creating signed URL for ${filePath}:`, signError);
							return null;
						}

						return signedUrlData?.signedUrl || null;
					})
				);

				// Filter out any null URLs (where signed URL creation failed)
				const validUrls = signedUrls.filter((url) => url !== null);

				return {
					user_name: item.user_full_name,
					user_email: item.user_email,
					signed_urls: validUrls
				};
			})
		);

		return json({ data: simplifiedData });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
