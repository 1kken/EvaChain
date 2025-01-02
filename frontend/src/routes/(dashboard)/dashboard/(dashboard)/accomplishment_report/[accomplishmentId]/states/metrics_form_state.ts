import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateAccomplishmentMetricSchema,
	UpdateAccomplishmentMetricSchema
} from '../schema/metrics_schema';

import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const ACCOMPLISHMENT_METRIC_FORM_KEY = Symbol('ACCOMPLISHMENT_METRIC_FORM_KEY');

type AccomplishmentMetricForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentMetricSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentMetricSchema>>;
};

export function setAccomplishmentMetricFormContext(forms: AccomplishmentMetricForm) {
	setContext(ACCOMPLISHMENT_METRIC_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentMetricFormContext() {
	const forms = getContext<AccomplishmentMetricForm>(ACCOMPLISHMENT_METRIC_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Metric form not found in context');
	}
	return forms;
}

export type { AccomplishmentMetricForm };
