import type { Database, Tables } from '$lib/types/database.types';
import type { Content, TableCell } from 'pdfmake/interfaces';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	fetchIndicatorYears,
	fetchPerformanceIndicators,
	fetchSdgAlignments,
	fetchStrategyPlans
} from '../helper';
import commaNumber from 'comma-number';

export async function generateBody(
	strategicPlan: Tables<'strategic_plan'>,
	supabase: SupabaseClient<Database>
): Promise<Content> {
	const ratingWidth = 30;
	const addedColumn = (strategicPlan.end_year - strategicPlan.start_year + 1) * 2;
	const addedColumnWidth = Array(addedColumn).fill(ratingWidth);
	const years = generateYearRange(strategicPlan.start_year, strategicPlan.end_year);
	const context: Content = {
		marginTop: 10,
		table: {
			widths: [
				'*', // strategy plan
				'*', // performance indicators
				'auto', // sdg alignment
				ratingWidth, // baseline target
				ratingWidth, // baseline actual
				...addedColumnWidth, // years targets and budgets
				'auto', // concerned offices
				'*' // remarks
			],
			headerRows: 1,
			body: [
				[
					{ text: 'STRATEGY PLAN', style: 'header' },
					{ text: 'PERFORMANCE INDICATOR', style: 'header' },
					{ text: 'SDG ALIGNMENT', style: 'header' },
					{
						colSpan: 2, // For baseline target and actual
						stack: [
							{
								text: 'BASELINE',
								style: 'header',
								bold: true,
								alignment: 'center'
							},
							{
								marginTop: 10,
								table: {
									widths: ['*', '*'],
									body: [
										[
											{
												text: 'Target',
												alignment: 'center',
												border: [false, true, false, false]
											},
											{
												text: 'Actual',
												alignment: 'center',
												border: [true, true, false, false]
											}
										]
									]
								}
							}
						]
					},
					{}, // Empty cell for colspan
					{
						colSpan: years.length, // For year targets
						stack: [
							{
								text: 'TARGETS',
								style: 'header',
								bold: true,
								alignment: 'center'
							},
							{
								marginTop: 10,
								table: {
									widths: Array(years.length).fill('*'),
									body: [[...generateYearColumn(years)]]
								}
							}
						]
					},
					...Array(years.length - 1).fill({}), // Empty cells for colspan
					{
						colSpan: years.length, // For year budgets
						stack: [
							{
								text: 'BUDGET',
								style: 'header',
								bold: true,
								alignment: 'center'
							},
							{
								marginTop: 10,
								table: {
									widths: Array(years.length).fill('*'),
									body: [[...generateYearColumn(years)]]
								}
							}
						]
					},
					...Array(years.length - 1).fill({}), // Empty cells for colspan
					{ text: 'CONCERNED OFFICE/S', style: 'header' },
					{ text: 'Remarks', style: 'header' }
				],
				...(await main(strategicPlan, supabase))
			]
		}
	};
	return context;
}

function generateYearRange(startYear: number, endYear: number): number[] {
	const years: number[] = [];
	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	}
	return years;
}

function generateYearColumn(years: number[]): TableCell[] {
	return years.map((year, index, array) => ({
		text: year.toString(),
		alignment: 'center',
		border: [index === 0 ? false : true, true, index === array.length - 1 ? false : true, false]
	}));
}

async function main(
	strategicPlan: Tables<'strategic_plan'>,
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const rows: TableCell[][] = [];
	const strategyPlans = await fetchStrategyPlans(strategicPlan.id, supabase);

	for (const strategyPlan of strategyPlans) {
		let isFirstStrategyPlan = true;
		const indicators = await fetchPerformanceIndicators(strategyPlan.id, supabase);
		for (const indicator of indicators) {
			const row = await generateIndicatorRow(
				isFirstStrategyPlan,
				strategyPlan.description,
				indicator,
				supabase
			);
			rows.push(row);
			isFirstStrategyPlan = false;
		}
	}
	return rows;
}

async function generateIndicatorRow(
	isFirstStrategyPlan: boolean,
	strategyPlanDescription: string,
	indicator: Tables<'strategy_plan_performance_indicator'>,
	supabase: SupabaseClient<Database>
): Promise<TableCell[]> {
	const sdgAlignments = await fetchSdgAlignments(indicator.id, supabase);
	const indicatorYears = await fetchIndicatorYears(indicator.id, supabase);
	const marginTop = 5;
	return [
		{ text: isFirstStrategyPlan ? strategyPlanDescription : '', marginTop: marginTop },
		{ text: indicator.performance_indicator, marginTop: marginTop },
		{ text: generateSdgAlignmentText(sdgAlignments), marginTop: marginTop },
		{ text: indicator.base_target, marginTop: marginTop },
		{ text: indicator.actual_target, marginTop: marginTop },
		...generateYearTargets(indicatorYears),
		...generateYearBudgets(indicatorYears),
		{ text: indicator.concerned_offices, marginTop: marginTop },
		{ text: indicator.remarks, marginTop: marginTop }
	];
}

function generateSdgAlignmentText(sdgAlignments: Tables<'sdg_alignment_view'>[]): string {
	let sdgAlignmentText = '';
	for (const [index, sdgAlignment] of sdgAlignments.entries()) {
		sdgAlignmentText += `Objective ${sdgAlignment.objective_position! + 1},\n`;
	}
	return sdgAlignmentText;
}

function generateYearTargets(indicatorYears: Tables<'strat_plan_yearly_plan'>[]): TableCell[] {
	const marginTop = 5;
	return indicatorYears.map((indicatorYear) => ({
		text: indicatorYear.target,
		alignment: 'center',
		marginTop: marginTop
	}));
}

function generateYearBudgets(indicatorYears: Tables<'strat_plan_yearly_plan'>[]): TableCell[] {
	const marginTop = 5;
	return indicatorYears.map((indicatorYear) => ({
		text: `${commaNumber(indicatorYear.budget)}`,
		alignment: 'center',
		marginTop: marginTop
	}));
}
