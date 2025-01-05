import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_STATE_KEY = Symbol(
	'ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_STATE_KEY'
);

type AccomplishmentProgramProjectTemplateState = {
	currentAccomplishmentProgramProjectsTemplate: Writable<
		Tables<'accomplishment_template_program_project'>[]
	>;
	size: Writable<number>;
	addAccomplishmentProgramProjectTemplate: (
		programProject: Tables<'accomplishment_template_program_project'>
	) => void;
	updateAccomplishmentProgramProjectTemplate: (
		id: string,
		updates: Partial<Tables<'accomplishment_template_program_project'>>
	) => void;
	removeAccomplishmentProgramProjectTemplate: (id: string) => void;
};

function createAccomplishmentProgramProjectTemplateStore(
	initialData?: Tables<'accomplishment_template_program_project'>[]
): AccomplishmentProgramProjectTemplateState {
	const currentAccomplishmentProgramProjectsTemplate = writable<
		Tables<'accomplishment_template_program_project'>[]
	>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentProgramProjectsTemplate changes
	currentAccomplishmentProgramProjectsTemplate.subscribe((projects) => {
		size.set(projects.length);
	});

	function addAccomplishmentProgramProjectTemplate(
		programProject: Tables<'accomplishment_template_program_project'>
	) {
		currentAccomplishmentProgramProjectsTemplate.update((projects) => [
			...projects,
			programProject
		]);
	}

	function updateAccomplishmentProgramProjectTemplate(
		id: string,
		updates: Partial<Tables<'accomplishment_template_program_project'>>
	) {
		currentAccomplishmentProgramProjectsTemplate.update((projects) =>
			projects.map((project) => (project.id === id ? { ...project, ...updates } : project))
		);
	}

	function removeAccomplishmentProgramProjectTemplate(id: string) {
		currentAccomplishmentProgramProjectsTemplate.update((projects) =>
			projects.filter((project) => project.id !== id)
		);
	}

	return {
		currentAccomplishmentProgramProjectsTemplate,
		size,
		addAccomplishmentProgramProjectTemplate,
		updateAccomplishmentProgramProjectTemplate,
		removeAccomplishmentProgramProjectTemplate
	};
}

export function getAccomplishmentProgramProjectTemplateStore(): AccomplishmentProgramProjectTemplateState {
	const store = getContext<AccomplishmentProgramProjectTemplateState>(
		ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_STATE_KEY
	);
	if (!store) {
		throw new Error('Accomplishment Program Project Template store not found in context');
	}
	return store;
}

export function setAccomplishmentProgramProjectTemplateStore(
	initialData?: Tables<'accomplishment_template_program_project'>[]
): AccomplishmentProgramProjectTemplateState {
	const store = createAccomplishmentProgramProjectTemplateStore(initialData);
	setContext(ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_STATE_KEY, store);
	return store;
}
