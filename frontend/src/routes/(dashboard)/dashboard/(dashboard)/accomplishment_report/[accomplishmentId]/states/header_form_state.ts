import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateAccomplishmentHeaderSchema,
	UpdateAccomplishmentHeaderSchema
} from '../schema/header_schema';

const ACCOMPLISHMENT_HEADER_FORM_KEY = Symbol('ACCOMPLISHMENT_HEADER_FORM_KEY');

type AccomplishmentHeaderForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentHeaderSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentHeaderSchema>>;
};

export function setAccomplishmentHeaderFormContext(forms: AccomplishmentHeaderForm) {
	setContext(ACCOMPLISHMENT_HEADER_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentHeaderFormContext() {
	const forms = getContext<AccomplishmentHeaderForm>(ACCOMPLISHMENT_HEADER_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Header form not found in context');
	}
	return forms;
}
