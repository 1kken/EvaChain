import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type { CreateDpcrCategorySchema, UpdateDpcrCategorySchema } from '../schema/category_schema';

const DPCR_CATEGORY_FORM_KEY = Symbol('DPCR_CATEGORY_FORM_KEY');

type DpcrCategoryForm = {
	updateForm: SuperValidated<Infer<UpdateDpcrCategorySchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateDpcrCategorySchema>>;
};

export function setDpcrCategoryFormContext(forms: DpcrCategoryForm) {
	setContext(DPCR_CATEGORY_FORM_KEY, forms);
	return forms;
}

export function getDpcrCategoryFormContext() {
	const forms = getContext<DpcrCategoryForm>(DPCR_CATEGORY_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('DPCR Category form not found in context');
	}
	return forms;
}
