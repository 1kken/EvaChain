import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OP_HEADER_STATE_KEY = Symbol('OP_HEADER_STATE_KEY');

type OpHeaderState = {
	currentOpHeaders: Writable<Tables<'op_header'>[]>;
	size: Writable<number>;
	addOpHeader: (opHeader: Tables<'op_header'>) => void;
	updateOpHeader: (id: string, updates: Partial<Tables<'op_header'>>) => void;
	removeOpHeader: (id: string) => void;
};

function createOpHeaderStore(initialData?: Tables<'op_header'>[]): OpHeaderState {
	const currentOpHeaders = writable<Tables<'op_header'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOpHeaders changes
	currentOpHeaders.subscribe((headers) => {
		size.set(headers.length);
	});

	function addOpHeader(opHeader: Tables<'op_header'>) {
		currentOpHeaders.update((headers) => [...headers, opHeader]);
	}

	function updateOpHeader(id: string, updates: Partial<Tables<'op_header'>>) {
		currentOpHeaders.update((headers) =>
			headers.map((header) => (header.id === id ? { ...header, ...updates } : header))
		);
	}

	function removeOpHeader(id: string) {
		currentOpHeaders.update((headers) => headers.filter((header) => header.id !== id));
	}

	return {
		currentOpHeaders,
		size,
		addOpHeader,
		updateOpHeader,
		removeOpHeader
	};
}

export function getOpHeaderStore(): OpHeaderState {
	const store = getContext<OpHeaderState>(OP_HEADER_STATE_KEY);
	if (!store) {
		throw new Error('Op Header store not found in context');
	}
	return store;
}

export function setOpHeaderStore(initialData?: Tables<'op_header'>[]): OpHeaderState {
	const store = createOpHeaderStore(initialData);
	setContext(OP_HEADER_STATE_KEY, store);
	return store;
}

export type { OpHeaderState };
