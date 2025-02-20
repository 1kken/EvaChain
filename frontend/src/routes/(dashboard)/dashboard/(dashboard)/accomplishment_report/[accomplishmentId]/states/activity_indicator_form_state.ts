import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateAccomplishmentActivityIndicatorSchema,
	UpdateAccomplishmentActivityIndicatorSchema
} from '../schema/indicator_schema';

const ACCOMPLISHMENT_ACTIVITY_INDICATOR_FORM_KEY = Symbol(
	'ACCOMPLISHMENT_ACTIVITY_INDICATOR_FORM_KEY'
);

type AccomplishmentActivityIndicatorForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentActivityIndicatorSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentActivityIndicatorSchema>>;
};

export function setAccomplishmentActivityIndicatorFormContext(
	forms: AccomplishmentActivityIndicatorForm
) {
	setContext(ACCOMPLISHMENT_ACTIVITY_INDICATOR_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentActivityIndicatorFormContext() {
	const forms = getContext<AccomplishmentActivityIndicatorForm>(
		ACCOMPLISHMENT_ACTIVITY_INDICATOR_FORM_KEY
	);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Activity Indicator form not found in context');
	}
	return forms;
}
