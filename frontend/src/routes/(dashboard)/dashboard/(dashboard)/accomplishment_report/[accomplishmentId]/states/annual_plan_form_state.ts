import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateAccomplishmentAnnualPlanSchema,
	UpdateAccomplishmentAnnualPlanSchema
} from '../schema/annual_plan_schema';

const ACCOMPLISHMENT_ANNUAL_PLAN_FORM_KEY = Symbol('ACCOMPLISHMENT_ANNUAL_PLAN_FORM_KEY');

type AccomplishmentAnnualPlanForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentAnnualPlanSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentAnnualPlanSchema>>;
};

export function setAccomplishmentAnnualPlanFormContext(forms: AccomplishmentAnnualPlanForm) {
	setContext(ACCOMPLISHMENT_ANNUAL_PLAN_FORM_KEY, forms);
	return forms;
}

export function getAccomplishmentAnnualPlanFormContext() {
	const forms = getContext<AccomplishmentAnnualPlanForm>(ACCOMPLISHMENT_ANNUAL_PLAN_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Accomplishment Annual Plan form not found in context');
	}
	return forms;
}
