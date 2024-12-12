import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '../../../utils/schemas/universal_delete_schema';
import type {
	CreateOtherFunctionSchema,
	UpdateOtherFunctionSchema
} from '../../../utils/schemas/other_function_schema';

const OTHER_FUNCTION_FORM_KEY = Symbol('OTHER_FUNCTION_FORM_KEY');

type CoreFunctionForm = {
	createOtherFunctionForm: SuperValidated<Infer<CreateOtherFunctionSchema>>;
	updateOtherFunctionForm: SuperValidated<Infer<UpdateOtherFunctionSchema>>;
	deleteOtherFunctionForm: SuperValidated<Infer<UniversalDeleteSchema>>;
};

export function setOtherFunctionFormContext(forms: CoreFunctionForm) {
	setContext(OTHER_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getOtherFunctionFormContext() {
	const forms = getContext<CoreFunctionForm>(OTHER_FUNCTION_FORM_KEY);
	if (!forms?.createOtherFunctionForm) {
		throw new Error('Sub other form not found in context');
	}
	return forms;
}
