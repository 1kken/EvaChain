import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type { CreateCoreFunctionSchema, DeleteCoreFunctionSchema } from '../core_function_schema';
import { getContext, setContext } from 'svelte';

const CORE_FUNCTION_FORM_KEY = Symbol('CORE_FUNCTION_FORM_KEY');

type CoreFunctionForm = {
	deleteCoreFunctionForm: SuperValidated<Infer<DeleteCoreFunctionSchema>>;
	createCoreFunctionForm: SuperValidated<Infer<CreateCoreFunctionSchema>>;
};

export function setCoreFunctionFormContext(forms: CoreFunctionForm) {
	setContext(CORE_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getCoreFunctionFormContext() {
	const forms = getContext<CoreFunctionForm>(CORE_FUNCTION_FORM_KEY);
	if (!forms?.createCoreFunctionForm) {
		throw new Error('Core Function form not found in context');
	}
	return forms;
}
