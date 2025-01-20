import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateOpAnnualPlanSchema,
	UpdateOpAnnualPlanSchema
} from '../schema/op_annual_plan_schema';

const OP_ANNUAL_PLAN_FORM_KEY = Symbol('OP_ANNUAL_PLAN_FORM_KEY');

type OpAnnualPlanForm = {
	updateForm: SuperValidated<Infer<UpdateOpAnnualPlanSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpAnnualPlanSchema>>;
};

export function setOpAnnualPlanFormContext(forms: OpAnnualPlanForm) {
	setContext(OP_ANNUAL_PLAN_FORM_KEY, forms);
	return forms;
}

export function getOpAnnualPlanFormContext() {
	const forms = getContext<OpAnnualPlanForm>(OP_ANNUAL_PLAN_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Op Annual Plan form not found in context');
	}
	return forms;
}
