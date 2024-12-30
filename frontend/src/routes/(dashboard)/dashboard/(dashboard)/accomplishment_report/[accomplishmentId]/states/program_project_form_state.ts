import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateAccomplishmentProgramProjectSchema,
	UpdateAccomplishmentProgramProjectSchema
} from '../schema/program_project_schema';

import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const ACCOMPLISHMENT_PROGRAM_PROJECT_FORM_KEY = Symbol('ACCOMPLISHMENT_PROGRAM_PROJECT_FORM_KEY');

type AccomplishmentProgramProjectForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentProgramProjectSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentProgramProjectSchema>>;
};

export function setAccomplishmentProgramProjectFormContext(
	forms: AccomplishmentProgramProjectForm
) {
	setContext(ACCOMPLISHMENT_PROGRAM_PROJECT_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentProgramProjectFormContext() {
	const forms = getContext<AccomplishmentProgramProjectForm>(
		ACCOMPLISHMENT_PROGRAM_PROJECT_FORM_KEY
	);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Program Project form not found in context');
	}
	return forms;
}

export type { AccomplishmentProgramProjectForm };
