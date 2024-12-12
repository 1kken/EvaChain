import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get all possible function IDs from URL parameters
		const subCoreFunctionId = url.searchParams.get('sub_core_function_id');
		const coreFunctionId = url.searchParams.get('core_function_id');
		const supportFunctionId = url.searchParams.get('support_function_id');
		const subSupportFunctionId = url.searchParams.get('sub_support_function_id');
		const otherFunctionId = url.searchParams.get('other_function_id');
		const subOtherFunctionId = url.searchParams.get('sub_other_function_id');

		// Handle support function query
		if (supportFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('support_function_id', supportFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch indicators' }, { status: 500 });
			}

			return json({ data: indicator });
		}

		// Handle sub-support function query
		if (subSupportFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('sub_support_function_id', subSupportFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch indicators' }, { status: 500 });
			}

			return json({ data: indicator });
		}

		// Handle core function query
		if (coreFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('core_function_id', coreFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch indicators' }, { status: 500 });
			}

			return json({ data: indicator });
		}

		// Handle sub-core function query
		if (subCoreFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('sub_core_function_id', subCoreFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch indicators' }, { status: 500 });
			}

			return json({ data: indicator });
		}

		// Handle other function query
		if (otherFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('other_function_id', otherFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch indicators' }, { status: 500 });
			}

			return json({ data: indicator });
		}

		// Handle sub-other function query
		if (subOtherFunctionId) {
			const { data: indicator, error } = await supabase
				.from('indicator')
				.select('*')
				.eq('sub_other_function_id', subOtherFunctionId)
				.order('position');

			if (error) {
				console.error('Database error:', error);
				return json({ error: 'Failed to fetch indicators' }, { status: 500 });
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
