import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateAccomplishmentProgramProjectSchemaTemplate,
	UpdateAccomplishmentProgramProjectSchemaTemplate
} from '../schema/program_project_schema';

import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_FORM_KEY = Symbol(
	'ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_FORM_KEY'
);

type AccomplishmentProgramProjectTemplateForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentProgramProjectSchemaTemplate>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentProgramProjectSchemaTemplate>>;
};

export function setAccomplishmentProgramProjectTemplateFormContext(
	forms: AccomplishmentProgramProjectTemplateForm
) {
	setContext(ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentProgramProjectTemplateFormContext() {
	const forms = getContext<AccomplishmentProgramProjectTemplateForm>(
		ACCOMPLISHMENT_PROGRAM_PROJECT_TEMPLATE_FORM_KEY
	);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Program Project Template form not found in context');
	}
	return forms;
}

export type { AccomplishmentProgramProjectTemplateForm };
