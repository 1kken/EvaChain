import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type { CreateDpcrFunctionSchema, UpdateDpcrFunctionSchema } from '../schema/function_schema';

const DPCR_FUNCTION_FORM_KEY = Symbol('DPCR_FUNCTION_FORM_KEY');

type DpcrFunctionForm = {
	updateForm: SuperValidated<Infer<UpdateDpcrFunctionSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateDpcrFunctionSchema>>;
};

export function setDpcrFunctionFormContext(forms: DpcrFunctionForm) {
	setContext(DPCR_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getDpcrFunctionFormContext() {
	const forms = getContext<DpcrFunctionForm>(DPCR_FUNCTION_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('DPCR Function form not found in context');
	}
	return forms;
}
