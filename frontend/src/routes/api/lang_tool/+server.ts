import { PUBLIC_DOCKER_API } from '$env/static/public';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Validate API key
		if (!PUBLIC_DOCKER_API) {
			throw error(500, 'API key not configured');
		}

		// Parse request body
		let requestBody;
		try {
			requestBody = await request.json();
		} catch (e) {
			throw error(400, 'Invalid JSON payload');
		}

		// Validate request body
		const { content: text } = requestBody;
		if (!text || typeof text !== 'string') {
			throw error(422, 'Text content is required and must be a string');
		}

		// Set up request parameters
		const header = { 'X-Api-Key': PUBLIC_DOCKER_API };
		const language = 'en-US';
		const url = `http://157.230.47.205/v2/check?text=${encodeURIComponent(text)}&language=${language}`;

		// Make API request
		let result;
		try {
			result = await fetch(url, {
				method: 'POST',
				headers: header
			});
		} catch (e) {
			throw error(503, 'Failed to reach grammar checking service');
		}

		// Handle API response errors
		if (!result.ok) {
			const status = result.status;
			let message = 'Grammar checking service error';

			switch (status) {
				case 401:
					message = 'Invalid API key';
					break;
				case 429:
					message = 'Rate limit exceeded';
					break;
				case 503:
					message = 'Grammar checking service unavailable';
					break;
			}

			throw error(status, message);
		}

		// Parse API response
		let data;
		try {
			data = await result.json();
		} catch (e) {
			throw error(502, 'Invalid response from grammar checking service');
		}

		// Validate response data
		if (!data || !Array.isArray(data.matches)) {
			throw error(502, 'Unexpected response format from grammar checking service');
		}

		return json(data.matches);
	} catch (e: any) {
		// Handle any uncaught errors
		if (e.status && e.body) {
			// Pass through SvelteKit errors
			throw e;
		}
		console.error('Unexpected error:', e);
		throw error(500, 'Internal server error');
	}
};
