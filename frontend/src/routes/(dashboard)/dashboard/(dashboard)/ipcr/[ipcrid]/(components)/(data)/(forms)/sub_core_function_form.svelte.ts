import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateSubCoreFunctionSchema,
	DeleteSubCoreFunctionSchema,
	UpdateSubCoreFunctionSchema
} from '../(schema)/sub_core_function_schema';
import { getContext, setContext } from 'svelte';

const SUB_CORE_FUNCTION_FORM_KEY = Symbol('SUB_CORE_FUNCTION_FORM_KEY');

type SubCoreFunctionForm = {
	updateSubCoreFunctionForm: SuperValidated<Infer<UpdateSubCoreFunctionSchema>>;
	deleteSubCoreFunctionForm: SuperValidated<Infer<DeleteSubCoreFunctionSchema>>;
	createSubCoreFunctionForm: SuperValidated<Infer<CreateSubCoreFunctionSchema>>;
};

export function setSubCoreFunctionFormContext(forms: SubCoreFunctionForm) {
	setContext(SUB_CORE_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getSubCoreFunctionFormContext() {
	const forms = getContext<SubCoreFunctionForm>(SUB_CORE_FUNCTION_FORM_KEY);
	if (!forms?.createSubCoreFunctionForm) {
		throw new Error('Sub Core Function form not found in context');
	}
	return forms;
}
