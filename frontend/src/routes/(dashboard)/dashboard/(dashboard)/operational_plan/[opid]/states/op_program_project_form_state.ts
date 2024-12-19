import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateOpProgramProjectSchema,
	UpdateOpProgramProjectSchema
} from '../schema/op_project_program_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const OP_PROGRAM_PROJECT_FORM_KEY = Symbol('OP_PROGRAM_PROJECT_FORM_KEY');

type OpProgramProjectForm = {
	updateForm: SuperValidated<Infer<UpdateOpProgramProjectSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpProgramProjectSchema>>;
};

export function setOpProgramProjectFormContext(forms: OpProgramProjectForm) {
	setContext(OP_PROGRAM_PROJECT_FORM_KEY, forms);
	return forms;
}

export function getOpProgramProjectFormContext() {
	const forms = getContext<OpProgramProjectForm>(OP_PROGRAM_PROJECT_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Op Program Project form not found in context');
	}
	return forms;
}
