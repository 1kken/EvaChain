import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get core_function_id from URL parameter
		const coreFunctionId = url.searchParams.get('core_function_id');

		if (!coreFunctionId) {
			return json({ error: 'core_function_id is required' }, { status: 400 });
		}

		// Query the database for sub core functions
		const { data: subCoreFunctions, error } = await supabase
			.from('sub_core_function')
			.select('*')
			.eq('core_function_id', coreFunctionId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch sub core functions' }, { status: 500 });
		}

		return json({ data: subCoreFunctions });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
