import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateStrategyPlanPerformanceIndicatorSchema,
	UpdateStrategyPlanPerformanceIndicatorSchema
} from '../schema/performance_indicator_schema';

const STRATEGY_PERFORMANCE_INDICATOR_FORM_KEY = Symbol('STRATEGY_PERFORMANCE_INDICATOR_FORM_KEY');

type StrategyPerformanceIndicatorForm = {
	updateForm: SuperValidated<Infer<UpdateStrategyPlanPerformanceIndicatorSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateStrategyPlanPerformanceIndicatorSchema>>;
};

export function setStrategyPerformanceIndicatorFormContext(
	forms: StrategyPerformanceIndicatorForm
) {
	setContext(STRATEGY_PERFORMANCE_INDICATOR_FORM_KEY, forms);
	return forms;
}

export function getStrategyPerformanceIndicatorFormContext() {
	const forms = getContext<StrategyPerformanceIndicatorForm>(
		STRATEGY_PERFORMANCE_INDICATOR_FORM_KEY
	);
	if (!forms?.createForm) {
		throw new Error('Strategy Performance Indicator form not found in context');
	}
	return forms;
}

export type { StrategyPerformanceIndicatorForm };
