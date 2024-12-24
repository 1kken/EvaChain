import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateIpcrFunctionCategorySchema,
	UpdateIpcrFunctionCategorySchema
} from '../schema/ipcr_category_schema';

const IPCR_FUNCTION_CATEGORY_FORM_KEY = Symbol('IPCR_FUNCTION_CATEGORY_FORM_KEY');

type IpcrFunctionForm = {
	updateForm: SuperValidated<Infer<UpdateIpcrFunctionCategorySchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateIpcrFunctionCategorySchema>>;
};

export function setIpcrFunctionCategoryFormContext(forms: IpcrFunctionForm) {
	setContext(IPCR_FUNCTION_CATEGORY_FORM_KEY, forms);
	return forms;
}

export function getIpcrFunctionCategoryFormContext() {
	const forms = getContext<IpcrFunctionForm>(IPCR_FUNCTION_CATEGORY_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('IPCR Function form not found in context');
	}
	return forms;
}
