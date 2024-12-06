import { error, json, type RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const coreFunctionId = url.searchParams.get('coreFunctionId');

		if (!coreFunctionId) {
			throw error(400, 'Core Function ID is required');
		}

		const { data: subCoreFunctions, error: supabaseError } = await supabase
			.from('sub_core_function')
			.select(
				`
                id,
                name,
                created_at,
                updated_at,
                core_function_id,
                core_function:core_function_id (
                    id,
                    name,
                    unit,
                    reviewer_id
                )
            `
			)
			.eq('core_function_id', coreFunctionId)
			.order('created_at', { ascending: true });

		if (supabaseError) {
			throw error(500, 'Error fetching sub core functions');
		}

		if (!subCoreFunctions) {
			throw error(404, 'Sub core functions not found');
		}

		return json({ subCoreFunctions });
	} catch (err) {
		console.error('Error in GET sub core functions:', err);
		throw error(500, 'Internal server error');
	}
};
