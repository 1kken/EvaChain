import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type { CreateOpHeaderSchema, UpdateOpHeaderSchema } from '../schema/op_header_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const OP_HEADER_FORM_KEY = Symbol('OP_HEADER_FORM_KEY');

type OpHeaderForm = {
	updateForm: SuperValidated<Infer<UpdateOpHeaderSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpHeaderSchema>>;
};

export function setOpHeaderFormContext(forms: OpHeaderForm) {
	setContext(OP_HEADER_FORM_KEY, forms);
	return forms;
}

export function getOpHeaderFormContext() {
	const forms = getContext<OpHeaderForm>(OP_HEADER_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Op Header form not found in context');
	}
	return forms;
}
