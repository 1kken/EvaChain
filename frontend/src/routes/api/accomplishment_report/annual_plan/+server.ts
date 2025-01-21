import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get accomplishment_header_id from URL parameter
		const headerId = url.searchParams.get('accomplishment_header_id');

		if (!headerId) {
			return json({ error: 'accomplishment_header_id is required' }, { status: 400 });
		}

		// Query the database for annual plans
		const { data: annualPlans, error } = await supabase
			.from('accomplishment_annual_plan')
			.select('*')
			.eq('accomplishment_header_id', headerId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch accomplishment annual plans' }, { status: 500 });
		}

		return json({ data: annualPlans });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'accomplishment_annual_plan'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('accomplishment_annual_plan')
				.update({
					position: item.position,
					updated_at: new Date().toISOString()
				})
				.eq('id', item.id);

			if (error) {
				throw error;
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error updating annual plan positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
