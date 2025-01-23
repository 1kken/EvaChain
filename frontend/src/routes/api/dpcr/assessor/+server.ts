import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const dpcrId = url.searchParams.get('dpcr_id');

		if (!dpcrId) {
			return json({ error: 'DPCR ID is Required' }, { status: 400 });
		}

		const { data: assessors, error } = await supabase
			.from('dpcr_assessor')
			.select('*')
			.eq('dpcr_id', dpcrId)
			.order('sequence');

		if (error) {
			console.log('aha error here');
			return json({ error: 'Failed to fetch assessors' }, { status: 500 });
		}

		return json({ data: assessors });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
