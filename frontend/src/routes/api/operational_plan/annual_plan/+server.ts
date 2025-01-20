import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get header_id from URL parameter
		const headerId = url.searchParams.get('op_header_id');

		if (!headerId) {
			return json({ error: 'op_header_id is required' }, { status: 400 });
		}

		// Query the database for annual plans
		const { data: annualPlans, error } = await supabase
			.from('op_annual_plan')
			.select('*')
			.eq('op_header_id', headerId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch annual plans' }, { status: 500 });
		}

		return json({ data: annualPlans });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'op_annual_plan'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('op_annual_plan')
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
