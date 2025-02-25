import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const ipcrFunctionId = url.searchParams.get('ipcr_function_id');
		const supervisorId = url.searchParams.get('supervisor_id');

		if (!ipcrFunctionId) {
			return json({ error: 'IPCR function ID is required' }, { status: 400 });
		}

		if (!supervisorId) {
			return json({ error: 'Supervisor ID is required' }, { status: 400 });
		}

		const { data: categories, error } = await supabase.rpc(
			'return_ipcr_function_category_if_immediate_supervisor_same',
			{
				p_ipcr_function_id: ipcrFunctionId,
				p_supervisor_id: supervisorId
			}
		);

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch categories' }, { status: 500 });
		}

		return json({ data: categories });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
