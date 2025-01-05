import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateAccomplishmentMetricSchemaTemplate,
	UpdateAccomplishmentMetricSchemaTemplate
} from '../schema/metrics_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const ACCOMPLISHMENT_METRIC_TEMPLATE_FORM_KEY = Symbol('ACCOMPLISHMENT_METRIC_TEMPLATE_FORM_KEY');

type AccomplishmentMetricTemplateForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentMetricSchemaTemplate>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentMetricSchemaTemplate>>;
};

export function setAccomplishmentMetricTemplateFormContext(
	forms: AccomplishmentMetricTemplateForm
) {
	setContext(ACCOMPLISHMENT_METRIC_TEMPLATE_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentMetricTemplateFormContext() {
	const forms = getContext<AccomplishmentMetricTemplateForm>(
		ACCOMPLISHMENT_METRIC_TEMPLATE_FORM_KEY
	);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Metric Template form not found in context');
	}
	return forms;
}

export type { AccomplishmentMetricTemplateForm };
