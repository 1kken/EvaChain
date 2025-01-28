import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const STRATEGY_PERFORMANCE_INDICATOR_STATE_KEY = Symbol('STRATEGY_PERFORMANCE_INDICATOR_STATE_KEY');

type StrategyPerformanceIndicatorState = {
	currentPerformanceIndicators: Writable<Tables<'strategy_plan_performance_indicator'>[]>;
	size: Writable<number>;
	addPerformanceIndicator: (indicator: Tables<'strategy_plan_performance_indicator'>) => void;
	updatePerformanceIndicator: (
		id: string,
		updates: Partial<Tables<'strategy_plan_performance_indicator'>>
	) => void;
	removePerformanceIndicator: (id: string) => void;
	getPerformanceIndicatorsByStrategyPlanId: (
		strategyPlanId: string
	) => Tables<'strategy_plan_performance_indicator'>[];
};

function createStrategyPerformanceIndicatorStore(
	initialData?: Tables<'strategy_plan_performance_indicator'>[]
): StrategyPerformanceIndicatorState {
	const currentPerformanceIndicators = writable<Tables<'strategy_plan_performance_indicator'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	currentPerformanceIndicators.subscribe((indicators) => {
		size.set(indicators.length);
	});

	function addPerformanceIndicator(indicator: Tables<'strategy_plan_performance_indicator'>) {
		currentPerformanceIndicators.update((indicators) => [...indicators, indicator]);
	}

	function updatePerformanceIndicator(
		id: string,
		updates: Partial<Tables<'strategy_plan_performance_indicator'>>
	) {
		currentPerformanceIndicators.update((indicators) =>
			indicators.map((indicator) =>
				indicator.id === id ? { ...indicator, ...updates } : indicator
			)
		);
	}

	function removePerformanceIndicator(id: string) {
		currentPerformanceIndicators.update((indicators) =>
			indicators.filter((indicator) => indicator.id !== id)
		);
	}

	function getPerformanceIndicatorsByStrategyPlanId(
		strategyPlanId: string
	): Tables<'strategy_plan_performance_indicator'>[] {
		let indicators: Tables<'strategy_plan_performance_indicator'>[] = [];
		currentPerformanceIndicators.subscribe((allIndicators) => {
			indicators = allIndicators.filter(
				(indicator) => indicator.strategy_plan_id === strategyPlanId
			);
		})();
		return indicators;
	}

	return {
		currentPerformanceIndicators,
		size,
		addPerformanceIndicator,
		updatePerformanceIndicator,
		removePerformanceIndicator,
		getPerformanceIndicatorsByStrategyPlanId
	};
}

export function getStrategyPerformanceIndicatorStore(): StrategyPerformanceIndicatorState {
	const store = getContext<StrategyPerformanceIndicatorState>(
		STRATEGY_PERFORMANCE_INDICATOR_STATE_KEY
	);
	if (!store) {
		throw new Error('Strategy Performance Indicator store not found in context');
	}
	return store;
}

export function setStrategyPerformanceIndicatorStore(
	initialData?: Tables<'strategy_plan_performance_indicator'>[]
): StrategyPerformanceIndicatorState {
	const store = createStrategyPerformanceIndicatorStore(initialData);
	setContext(STRATEGY_PERFORMANCE_INDICATOR_STATE_KEY, store);
	return store;
}

export type { StrategyPerformanceIndicatorState };
