import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const DPCR_ASSESSOR_STATE_KEY = Symbol('DPCR_ASSESSOR_STATE_KEY');

type DpcrAssessorState = {
	currentAssessors: Writable<Tables<'dpcr_assessor'>[]>;
	addAssessor: (assessor: Tables<'dpcr_assessor'>) => void;
	updateAssessor: (id: string, updates: Partial<Tables<'dpcr_assessor'>>) => void;
	removeAssessor: (id: string) => void;
};

function createDpcrAssessorStore(initialData?: Tables<'dpcr_assessor'>[]): DpcrAssessorState {
	const currentAssessors = writable<Tables<'dpcr_assessor'>[]>(initialData || []);

	function addAssessor(assessor: Tables<'dpcr_assessor'>) {
		currentAssessors.update((assessors) => [...assessors, assessor]);
	}

	function updateAssessor(id: string, updates: Partial<Tables<'dpcr_assessor'>>) {
		currentAssessors.update((assessors) =>
			assessors.map((assessor) => (assessor.id === id ? { ...assessor, ...updates } : assessor))
		);
	}

	function removeAssessor(id: string) {
		currentAssessors.update((assessors) => assessors.filter((assessor) => assessor.id !== id));
	}

	return {
		currentAssessors,
		addAssessor,
		updateAssessor,
		removeAssessor
	};
}

export function getDpcrAssessorStore(): DpcrAssessorState {
	const store = getContext<DpcrAssessorState>(DPCR_ASSESSOR_STATE_KEY);
	if (!store) {
		throw new Error('DPCR Assessor store not found in context');
	}
	return store;
}

export function setDpcrAssessorStore(initialData?: Tables<'dpcr_assessor'>[]): DpcrAssessorState {
	const store = createDpcrAssessorStore(initialData);
	setContext(DPCR_ASSESSOR_STATE_KEY, store);
	return store;
}

export type { DpcrAssessorState };
