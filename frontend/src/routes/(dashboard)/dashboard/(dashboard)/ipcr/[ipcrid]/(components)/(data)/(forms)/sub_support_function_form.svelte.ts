import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateSubSupportFunctionSchema,
	UpdateSubSupportFunctionSchema
} from '../../../utils/schemas/sub_support_function_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '../../../utils/schemas/universal_delete_schema';

const SUB_SUPPORT_FUNCTION_FORM_KEY = Symbol('SUB_SUPPORT_FUNCTION_FORM_KEY');

type SubSupportFunctionForm = {
	updateSubSupportFunctionForm: SuperValidated<Infer<UpdateSubSupportFunctionSchema>>;
	deleteSubSupportFunctionForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createSubSupportFunctionForm: SuperValidated<Infer<CreateSubSupportFunctionSchema>>;
};

export function setSubSupportFunctionFormContext(forms: SubSupportFunctionForm) {
	setContext(SUB_SUPPORT_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getSubSupportFunctionFormContext() {
	const forms = getContext<SubSupportFunctionForm>(SUB_SUPPORT_FUNCTION_FORM_KEY);
	if (!forms?.createSubSupportFunctionForm) {
		throw new Error('Sub Support Function form not found in context');
	}
	return forms;
}
