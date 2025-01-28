import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateStrategyPlanSchema,
	UpdateStrategyPlanSchema
} from '../schema/strategy_plan_schema';

const STRATEGY_PLAN_FORM_KEY = Symbol('STRATEGY_PLAN_FORM_KEY');

type StrategyPlanForm = {
	updateForm: SuperValidated<Infer<UpdateStrategyPlanSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateStrategyPlanSchema>>;
};

export function setStrategyPlanFormContext(forms: StrategyPlanForm) {
	setContext(STRATEGY_PLAN_FORM_KEY, forms);
	return forms;
}

export function getStrategyPlanFormContext() {
	const forms = getContext<StrategyPlanForm>(STRATEGY_PLAN_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Strategy Plan form not found in context');
	}
	return forms;
}

export type { StrategyPlanForm };
