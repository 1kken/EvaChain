import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OP_OBJECTIVE_STATE_KEY = Symbol('OP_OBJECTIVE_STATE_KEY');

type OpObjectiveState = {
	currentOpObjectives: Writable<Tables<'op_objectives'>[]>;
	size: Writable<number>;
	addOpObjective: (opObjective: Tables<'op_objectives'>) => void;
	updateOpObjective: (id: string, updates: Partial<Tables<'op_objectives'>>) => void;
	removeOpObjective: (id: string) => void;
	getObjectivesByProgramId: (programId: string) => Tables<'op_objectives'>[];
};

function createOpObjectiveStore(initialData?: Tables<'op_objectives'>[]): OpObjectiveState {
	const currentOpObjectives = writable<Tables<'op_objectives'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOpObjectives changes
	currentOpObjectives.subscribe((objectives) => {
		size.set(objectives.length);
	});

	function addOpObjective(opObjective: Tables<'op_objectives'>) {
		currentOpObjectives.update((objectives) => [...objectives, opObjective]);
	}

	function updateOpObjective(id: string, updates: Partial<Tables<'op_objectives'>>) {
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

	// Added helper function to get objectives by program project ID
	function getObjectivesByProgramId(programId: string): Tables<'op_objectives'>[] {
		let objectives: Tables<'op_objectives'>[] = [];
		currentOpObjectives.subscribe((currentObjectives) => {
			objectives = currentObjectives.filter(
				(objective) => objective.op_program_project_id === programId
			);
		})();
		return objectives;
	}

	return {
		currentOpObjectives,
		size,
		addOpObjective,
		updateOpObjective,
		removeOpObjective,
		getObjectivesByProgramId
	};
}

export function getOpObjectiveStore(): OpObjectiveState {
	const store = getContext<OpObjectiveState>(OP_OBJECTIVE_STATE_KEY);
	if (!store) {
		throw new Error('Op Objective store not found in context');
	}
	return store;
}

export function setOpObjectiveStore(initialData?: Tables<'op_objectives'>[]): OpObjectiveState {
	const store = createOpObjectiveStore(initialData);
	setContext(OP_OBJECTIVE_STATE_KEY, store);
	return store;
}

export type { OpObjectiveState };
