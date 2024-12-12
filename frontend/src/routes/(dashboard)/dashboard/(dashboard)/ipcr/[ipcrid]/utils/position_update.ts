import type { Tables } from '$lib/types/database.types';
import debounce from 'debounce';

export const updateSubCoreFunctionPositions = debounce(
	async (items: Tables<'sub_core_function'>[]) => {
		if (items.length === 0) return;

		try {
			const response = await fetch('/api/sub_core_function', {
				// Adjust endpoint as needed
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});
			if (!response.ok) {
				throw new Error('Failed to update positions');
			}

			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	},
	2000
);

export const updateSubSupportFunctionPositions = debounce(
	async (items: Tables<'sub_support_function'>[]) => {
		if (items.length === 0) return;

		try {
			const response = await fetch('/api/sub_support_function', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});

			if (!response.ok) {
				throw new Error('Failed to update positions');
			}

			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	},
	2000
);

export const updateSubOtherFunctionPositions = debounce(
	async (items: Tables<'sub_other_function'>[]) => {
		if (items.length === 0) return;

		try {
			const response = await fetch('/api/sub_other_function', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});

			if (!response.ok) {
				throw new Error('Failed to update positions');
			}

			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	},
	2000
);

export const updateIndicatorPositions = debounce(async (items: Tables<'indicator'>[]) => {
	if (items.length === 0) return;

	try {
		const response = await fetch('/api/indicator', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});
		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error('Error updating positions:', error);
		throw error;
	}
}, 2000);
