import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateIpcrFunctionSubCategorySchema,
	UpdateIpcrFunctionSubCategorySchema
} from '../schema/ipcr_sub_category_schema';

const IPCR_FUNCTION_SUB_CATEGORY_FORM_KEY = Symbol('IPCR_FUNCTION_SUB_CATEGORY_FORM_KEY');

type IpcrFunctionSubCategoryForm = {
	updateForm: SuperValidated<Infer<UpdateIpcrFunctionSubCategorySchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateIpcrFunctionSubCategorySchema>>;
};

export function setIpcrFunctionSubCategoryFormContext(forms: IpcrFunctionSubCategoryForm) {
	setContext(IPCR_FUNCTION_SUB_CATEGORY_FORM_KEY, forms);
	return forms;
}

export function getIpcrFunctionSubCategoryFormContext() {
	const forms = getContext<IpcrFunctionSubCategoryForm>(IPCR_FUNCTION_SUB_CATEGORY_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('IPCR Function Sub-Category form not found in context');
	}
	return forms;
}

export type { IpcrFunctionSubCategoryForm };
