import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_HEADER_STATE_KEY = Symbol('ACCOMPLISHMENT_HEADER_STATE_KEY');

type AccomplishmentHeaderState = {
	currentAccomplishmentHeaders: Writable<Tables<'accomplishment_header'>[]>;
	size: Writable<number>;
	addAccomplishmentHeader: (accomplishmentHeader: Tables<'accomplishment_header'>) => void;
	updateAccomplishmentHeader: (
		id: string,
		updates: Partial<Tables<'accomplishment_header'>>
	) => void;
	removeAccomplishmentHeader: (id: string) => void;
};

function createAccomplishmentHeaderStore(
	initialData?: Tables<'accomplishment_header'>[]
): AccomplishmentHeaderState {
	const currentAccomplishmentHeaders = writable<Tables<'accomplishment_header'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentHeaders changes
	currentAccomplishmentHeaders.subscribe((headers) => {
		size.set(headers.length);
	});

	function addAccomplishmentHeader(accomplishmentHeader: Tables<'accomplishment_header'>) {
		currentAccomplishmentHeaders.update((headers) => [...headers, accomplishmentHeader]);
	}

	function updateAccomplishmentHeader(
		id: string,
		updates: Partial<Tables<'accomplishment_header'>>
	) {
		currentAccomplishmentHeaders.update((headers) =>
			headers.map((header) => (header.id === id ? { ...header, ...updates } : header))
		);
	}

	function removeAccomplishmentHeader(id: string) {
		currentAccomplishmentHeaders.update((headers) => headers.filter((header) => header.id !== id));
	}

	return {
		currentAccomplishmentHeaders,
		size,
		addAccomplishmentHeader,
		updateAccomplishmentHeader,
		removeAccomplishmentHeader
	};
}

export function getAccomplishmentHeaderStore(): AccomplishmentHeaderState {
	const store = getContext<AccomplishmentHeaderState>(ACCOMPLISHMENT_HEADER_STATE_KEY);
	if (!store) {
		throw new Error('Accomplishment Header store not found in context');
	}
	return store;
}

export function setAccomplishmentHeaderStore(
	initialData?: Tables<'accomplishment_header'>[]
): AccomplishmentHeaderState {
	const store = createAccomplishmentHeaderStore(initialData);
	setContext(ACCOMPLISHMENT_HEADER_STATE_KEY, store);
	return store;
}

export type { AccomplishmentHeaderState };
