import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '../../../utils/schemas/universal_delete_schema';
import type {
	CreateOtherFunctionSchema,
	UpdateOtherFunctionSchema
} from '../../../utils/schemas/other_function_schema';
import type {
	CreateSubOtherFunctionSchema,
	UpdateSubOtherFunctionSchema
} from '../../../utils/schemas/sub_other_function_schema';

const SUB_OTHER_FUNCTION_FORM_KEY = Symbol('SUB_OTHER_FUNCTION_FORM_KEY');

type CoreFunctionForm = {
	createSubOtherFunctionForm: SuperValidated<Infer<CreateSubOtherFunctionSchema>>;
	updateSubOtherFunctionForm: SuperValidated<Infer<UpdateSubOtherFunctionSchema>>;
	deleteSubOtherFunctionForm: SuperValidated<Infer<UniversalDeleteSchema>>;
};

export function setSubOtherFunctionFormContext(forms: CoreFunctionForm) {
	setContext(SUB_OTHER_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getSubOtherFunctionFormContext() {
	const forms = getContext<CoreFunctionForm>(SUB_OTHER_FUNCTION_FORM_KEY);
	if (!forms?.createSubOtherFunctionForm) {
		throw new Error('Sub other form not found in context');
	}
	return forms;
}
