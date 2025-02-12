// src/routes/api/query/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getResponse } from './helper';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parse the incoming request body
		const { query } = await request.json();

		if (!query) {
			return json({ error: 'No query provided' }, { status: 400 });
		}

		// Get response using your agent
		const response = await getResponse(query);
		return json({ data: response });
	} catch (error) {
		console.error('Query processing error:', error);
		return json({ error: 'Failed to process query' }, { status: 500 });
	}
};
