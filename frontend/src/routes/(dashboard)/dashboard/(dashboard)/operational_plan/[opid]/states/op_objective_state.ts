import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OP_OBJECTIVE_STATE_KEY = Symbol('OP_OBJECTIVE_STATE_KEY');

type OpObjectiveState = {
	currentOpObjectives: Writable<Tables<'op_objective'>[]>;
	size: Writable<number>;
	addOpObjective: (opObjective: Tables<'op_objective'>) => void;
	updateOpObjective: (id: string, updates: Partial<Tables<'op_objective'>>) => void;
	removeOpObjective: (id: string) => void;
};

function createOpObjectiveStore(initialData?: Tables<'op_objective'>[]): OpObjectiveState {
	const currentOpObjectives = writable<Tables<'op_objective'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOpObjectives changes
	currentOpObjectives.subscribe((objectives) => {
		size.set(objectives.length);
	});

	function addOpObjective(opObjective: Tables<'op_objective'>) {
		currentOpObjectives.update((objectives) => [...objectives, opObjective]);
	}

	function updateOpObjective(id: string, updates: Partial<Tables<'op_objective'>>) {
		currentOpObjectives.update((objectives) =>
			objectives.map((objective) =>
				objective.id === id ? { ...objective, ...updates } : objective
			)
		);
	}

	function removeOpObjective(id: string) {
		currentOpObjectives.update((objectives) =>
			objectives.filter((objective) => objective.id !== id)
		);
	}

	return {
		currentOpObjectives,
		size,
		addOpObjective,
		updateOpObjective,
		removeOpObjective
	};
}

export function getOpObjectiveStore(): OpObjectiveState {
	const store = getContext<OpObjectiveState>(OP_OBJECTIVE_STATE_KEY);
	if (!store) {
		throw new Error('Op Objective store not found in context');
	}
	return store;
}

export function setOpObjectiveStore(initialData?: Tables<'op_objective'>[]): OpObjectiveState {
	const store = createOpObjectiveStore(initialData);
	setContext(OP_OBJECTIVE_STATE_KEY, store);
	return store;
}

export type { OpObjectiveState };
