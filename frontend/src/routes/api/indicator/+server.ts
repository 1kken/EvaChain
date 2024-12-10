import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get sub_core_function_id from URL parameter
		const subCoreFunctionId = url.searchParams.get('sub_core_function_id');
		// Get core_function_id from URL parameter
		const coreFunctionId = url.searchParams.get('core_function_id');
		if (subCoreFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('sub_core_function_id', subCoreFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch sub core functions' }, { status: 500 });
			}

			return json({ data: indicator });
		}
		if (coreFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('core_function_id', coreFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch sub core functions' }, { status: 500 });
			}

			return json({ data: indicator });
		}
		return json({ error: 'Unprocessable input!' }, { status: 422 });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'indicator'>[] = await request.json();
		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('indicator')
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
		console.error('Error updating indicator positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
