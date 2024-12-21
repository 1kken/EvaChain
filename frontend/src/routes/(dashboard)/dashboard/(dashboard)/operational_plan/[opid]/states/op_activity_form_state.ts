import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type { CreateOpActivitySchema, UpdateOpActivitySchema } from '../schema/op_activity_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const OP_ACTIVITY_FORM_KEY = Symbol('OP_ACTIVITY_FORM_KEY');

type OpActivityForm = {
	updateForm: SuperValidated<Infer<UpdateOpActivitySchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpActivitySchema>>;
};

export function setOpActivityFormContext(forms: OpActivityForm) {
	setContext(OP_ACTIVITY_FORM_KEY, forms);
	return forms;
}

export function getOpActivityFormContext() {
	const forms = getContext<OpActivityForm>(OP_ACTIVITY_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Op Activity form not found in context');
	}
	return forms;
}
