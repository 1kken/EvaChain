import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type { CreateOpcrFunctionSchema, UpdateOpcrFunctionSchema } from '../schema/function_schema';

const OPCR_FUNCTION_FORM_KEY = Symbol('OPCR_FUNCTION_FORM_KEY');

type OpcrFunctionForm = {
	updateForm: SuperValidated<Infer<UpdateOpcrFunctionSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpcrFunctionSchema>>;
};

export function setOpcrFunctionFormContext(forms: OpcrFunctionForm) {
	setContext(OPCR_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getOpcrFunctionFormContext() {
	const forms = getContext<OpcrFunctionForm>(OPCR_FUNCTION_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('OPCR Function form not found in context');
	}
	return forms;
}
