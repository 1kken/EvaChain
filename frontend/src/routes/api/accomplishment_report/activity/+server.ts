import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get accomplishment_annual_plan_id from URL parameter
		const annualPlanId = url.searchParams.get('accomplishment_annual_plan_id');

		if (!annualPlanId) {
			return json({ error: 'accomplishment_annual_plan_id is required' }, { status: 400 });
		}

		// Query the database for activities
		const { data: activities, error } = await supabase
			.from('accomplishment_activity')
			.select('*')
			.eq('accomplishment_annual_plan_id', annualPlanId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch accomplishment activities' }, { status: 500 });
		}

		return json({ data: activities });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'accomplishment_activity'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('accomplishment_activity')
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
		console.error('Error updating activity positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
