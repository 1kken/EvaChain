import { Tables } from '$lib/types/database.types';

export type StrategyPlanFormResult = {
	form: any;
	strategyPlan: Tables<'strategy_plan'>;
};

export type PerformanceIndicatorFormResult = {
	form: any;
	performanceIndicator: Tables<'strategy_plan_performance_indicator'>;
};

export type StrategicPlanFormResult = {
	form: any;
	strategicPlan: Tables<'strategic_plan'>;
};
