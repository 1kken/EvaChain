import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_PROGRAM_PROJECT_STATE_KEY = Symbol('ACCOMPLISHMENT_PROGRAM_PROJECT_STATE_KEY');

type AccomplishmentProgramProjectState = {
	currentAccomplishmentProgramProjects: Writable<Tables<'accomplishment_program_project'>[]>;
	size: Writable<number>;
	addAccomplishmentProgramProject: (
		programProject: Tables<'accomplishment_program_project'>
	) => void;
	updateAccomplishmentProgramProject: (
		id: string,
		updates: Partial<Tables<'accomplishment_program_project'>>
	) => void;
	removeAccomplishmentProgramProject: (id: string) => void;
};

function createAccomplishmentProgramProjectStore(
	initialData?: Tables<'accomplishment_program_project'>[]
): AccomplishmentProgramProjectState {
	const currentAccomplishmentProgramProjects = writable<Tables<'accomplishment_program_project'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentProgramProjects changes
	currentAccomplishmentProgramProjects.subscribe((projects) => {
		size.set(projects.length);
	});

	function addAccomplishmentProgramProject(
		programProject: Tables<'accomplishment_program_project'>
	) {
		currentAccomplishmentProgramProjects.update((projects) => [...projects, programProject]);
	}

	function updateAccomplishmentProgramProject(
		id: string,
		updates: Partial<Tables<'accomplishment_program_project'>>
	) {
		currentAccomplishmentProgramProjects.update((projects) =>
			projects.map((project) => (project.id === id ? { ...project, ...updates } : project))
		);
	}

	function removeAccomplishmentProgramProject(id: string) {
		currentAccomplishmentProgramProjects.update((projects) =>
			projects.filter((project) => project.id !== id)
		);
	}

	return {
		currentAccomplishmentProgramProjects,
		size,
		addAccomplishmentProgramProject,
		updateAccomplishmentProgramProject,
		removeAccomplishmentProgramProject
	};
}

export function getAccomplishmentProgramProjectStore(): AccomplishmentProgramProjectState {
	const store = getContext<AccomplishmentProgramProjectState>(
		ACCOMPLISHMENT_PROGRAM_PROJECT_STATE_KEY
	);
	if (!store) {
		throw new Error('Accomplishment Program Project store not found in context');
	}
	return store;
}

export function setAccomplishmentProgramProjectStore(
	initialData?: Tables<'accomplishment_program_project'>[]
): AccomplishmentProgramProjectState {
	const store = createAccomplishmentProgramProjectStore(initialData);
	setContext(ACCOMPLISHMENT_PROGRAM_PROJECT_STATE_KEY, store);
	return store;
}
