export async function sendBotQuery(query: string) {
	try {
		const response = await fetch('/api/bot', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query })
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to get bot response');
		}

		// Make sure we're returning just the data string
		return result.data;
	} catch (error) {
		// Instead of returning an error object, throw the error
		throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
	}
}
