import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateAccomplishmentActivitySchema,
	UpdateAccomplishmentActivitySchema
} from '../schema/activity_schema';

const ACCOMPLISHMENT_ACTIVITY_FORM_KEY = Symbol('ACCOMPLISHMENT_ACTIVITY_FORM_KEY');

type AccomplishmentActivityForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentActivitySchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentActivitySchema>>;
};

export function setAccomplishmentActivityFormContext(forms: AccomplishmentActivityForm) {
	setContext(ACCOMPLISHMENT_ACTIVITY_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentActivityFormContext() {
	const forms = getContext<AccomplishmentActivityForm>(ACCOMPLISHMENT_ACTIVITY_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Activity form not found in context');
	}
	return forms;
}
