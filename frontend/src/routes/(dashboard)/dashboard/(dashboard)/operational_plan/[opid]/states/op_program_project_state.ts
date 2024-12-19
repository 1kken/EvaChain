import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OP_PROGRAM_PROJECT_STATE_KEY = Symbol('OP_PROGRAM_PROJECT_STATE_KEY');

type OpProgramProjectState = {
	currentOpProgramProjects: Writable<Tables<'op_program_project'>[]>;
	size: Writable<number>;
	addOpProgramProject: (programProject: Tables<'op_program_project'>) => void;
	updateOpProgramProject: (id: string, updates: Partial<Tables<'op_program_project'>>) => void;
	removeOpProgramProject: (id: string) => void;
};

function createOpProgramProjectStore(
	initialData?: Tables<'op_program_project'>[]
): OpProgramProjectState {
	const currentOpProgramProjects = writable<Tables<'op_program_project'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOpProgramProjects changes
	currentOpProgramProjects.subscribe((projects) => {
		size.set(projects.length);
	});

	function addOpProgramProject(programProject: Tables<'op_program_project'>) {
		currentOpProgramProjects.update((projects) => [...projects, programProject]);
	}

	function updateOpProgramProject(id: string, updates: Partial<Tables<'op_program_project'>>) {
		currentOpProgramProjects.update((projects) =>
			projects.map((project) => (project.id === id ? { ...project, ...updates } : project))
		);
	}

	function removeOpProgramProject(id: string) {
		currentOpProgramProjects.update((projects) => projects.filter((project) => project.id !== id));
	}

	return {
		currentOpProgramProjects,
		size,
		addOpProgramProject,
		updateOpProgramProject,
		removeOpProgramProject
	};
}

export function getOpProgramProjectStore(): OpProgramProjectState {
	const store = getContext<OpProgramProjectState>(OP_PROGRAM_PROJECT_STATE_KEY);
	if (!store) {
		throw new Error('Op Program Project store not found in context');
	}
	return store;
}

export function setOpProgramProjectStore(
	initialData?: Tables<'op_program_project'>[]
): OpProgramProjectState {
	const store = createOpProgramProjectStore(initialData);
	setContext(OP_PROGRAM_PROJECT_STATE_KEY, store);
	return store;
}

export type { OpProgramProjectState };
