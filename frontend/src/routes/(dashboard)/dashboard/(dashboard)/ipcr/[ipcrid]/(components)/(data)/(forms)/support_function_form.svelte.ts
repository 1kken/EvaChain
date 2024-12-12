import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateSuppportFunctionSchema,
	UpdateSupportFunctionSchema
} from '../../../utils/schemas/support_function_schema';
import type { UniversalDeleteSchema } from '../../../utils/schemas/universal_delete_schema';
import { getContext, setContext } from 'svelte';

const SUPPORT_FUNCTION_FORM_KEY = Symbol('SUPPORT_FUNCTION_FORM');

type SupportFunctionForm = {
	updateSupportFunctionForm: SuperValidated<Infer<UpdateSupportFunctionSchema>>;
	deleteSupportFunctionForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createSupportFunctionForm: SuperValidated<Infer<CreateSuppportFunctionSchema>>;
};

export function setSupportFunctionFormContext(forms: SupportFunctionForm) {
	setContext(SUPPORT_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getSupportFunctionFormContext() {
	const forms = getContext<SupportFunctionForm>(SUPPORT_FUNCTION_FORM_KEY);
	if (!forms?.createSupportFunctionForm) {
		throw new Error('Support Function form not found in context');
	}
	return forms;
}
