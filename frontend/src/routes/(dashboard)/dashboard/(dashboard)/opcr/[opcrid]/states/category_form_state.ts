import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type { CreateOpcrCategorySchema, UpdateOpcrCategorySchema } from '../schema/category_schema';

const OPCR_CATEGORY_FORM_KEY = Symbol('OPCR_CATEGORY_FORM_KEY');

type OpcrCategoryForm = {
	updateForm: SuperValidated<Infer<UpdateOpcrCategorySchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpcrCategorySchema>>;
};

export function setOpcrCategoryFormContext(forms: OpcrCategoryForm) {
	setContext(OPCR_CATEGORY_FORM_KEY, forms);
	return forms;
}

export function getOpcrCategoryFormContext() {
	const forms = getContext<OpcrCategoryForm>(OPCR_CATEGORY_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('OPCR Category form not found in context');
	}
	return forms;
}
