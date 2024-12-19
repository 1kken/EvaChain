import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateOpObjectiveSchema,
	UpdateOpObjectiveSchema
} from '../schema/op_objective_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const OP_OBJECTIVE_FORM_KEY = Symbol('OP_OBJECTIVE_FORM_KEY');

type OpObjectiveForm = {
	updateForm: SuperValidated<Infer<UpdateOpObjectiveSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpObjectiveSchema>>;
};

export function setOpObjectiveFormContext(forms: OpObjectiveForm) {
	setContext(OP_OBJECTIVE_FORM_KEY, forms);
	return forms;
}

export function getOpObjectiveFormContext() {
	const forms = getContext<OpObjectiveForm>(OP_OBJECTIVE_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Op Objective form not found in context');
	}
	return forms;
}
