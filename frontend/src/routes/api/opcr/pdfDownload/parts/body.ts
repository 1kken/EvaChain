import type { Database, Tables } from '$lib/types/database.types';
import type { Content, TableCell } from 'pdfmake/interfaces';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	fetchOpcrDataFunction,
	fetchOpcrIndicatorsByCategoryId,
	fetchOpcrFunctionsByOpcrId
} from '../helper';

export async function generateBody(
	opcr: Tables<'opcr'>,
	supabase: SupabaseClient<Database>
): Promise<Content> {
	const opcrFunctions = await fetchOpcrFunctionsByOpcrId(supabase, opcr.id);
	const ratingWidth: number = 30;
	const cotext: Content = {
		marginTop: 10,
		table: {
			widths: [
				'*', //major final output
				'*', //success indicators
				'*', //alloted budget
				'*', //individuals
				'*', //accomplishments
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth,
				'*' // remarks
			],
			headerRows: 1,
			body: [
				[
					{ text: 'Major Final Output', style: 'header' },
					{ text: 'Success Indicators (Targets + Measures)', style: 'header' },
					{ text: 'Allotted Budget', style: 'header' },
					{ text: 'Divisions/ Individuals Accountable', style: 'header' },
					{ text: 'Actual Accomplishments', style: 'header' },
					{
						colSpan: 4,
						stack: [
							{
								text: 'Rating',
								style: 'header',
								bold: true,
								alignment: 'center'
							},
							{
								marginTop: 10,
								table: {
									widths: ['*', '*', '*', '*'],
									body: [
										[
											{
												text: [
													{ text: 'Q', style: 'normalText' },
													{ text: '1', sup: true }
												],
												alignment: 'center',
												border: [false, true, true, false]
											},
											{
												text: [
													{ text: 'E', style: 'normalText' },
													{ text: '2', sup: true }
												],
												alignment: 'center',
												border: [true, true, true, false]
											},
											{
												text: [
													{ text: 'T', style: 'normalText' },
													{ text: '3', sup: true }
												],
												alignment: 'center',
												border: [true, true, true, false]
											},
											{
												text: [
													{ text: 'A', style: 'normalText' },
													{ text: '4', sup: true }
												],
												alignment: 'center',
												border: [true, true, false, false]
											}
										]
									]
								}
							}
						]
					},
					{},
					{},
					{},
					{ text: 'Remarks', style: 'header' }
				],
				...(await main(opcrFunctions, supabase))
			]
		}
	};

	return cotext;
}

let finalAverageRating = 0;
let numberofIndicators = 0;

async function main(
	opcrFunctions: Tables<'opcr_function'>[],
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const rows: TableCell[][] = [];

	for (const opcrFunction of opcrFunctions) {
		rows.push(generateFunctionCategoryRow(opcrFunction.title));
		//fetch function details
		const functionData = await fetchOpcrDataFunction(opcrFunction.id, supabase);

		for (const data of functionData) {
			if (data.type === 'category') {
				let category = data.data as Tables<'opcr_function_category'>;
				rows.push(generateFunctionCategoryRow(category.category));
				const indicators = await fetchOpcrIndicatorsByCategoryId(category.id, supabase);
				for (const indicator of indicators) {
					finalAverageRating += indicator.average_rating ?? 0;
					numberofIndicators++;
					rows.push(generateFunctionIndicatorRow(indicator));
				}
			} else {
				let indicator = data.data as Tables<'opcr_indicator'>;
				finalAverageRating += indicator.average_rating ?? 0;
				numberofIndicators++;
				rows.push(generateFunctionIndicatorRow(indicator));
			}
		}
	}
	rows.push(...generateAverageFooter());
	return rows;
}

function generateFunctionCategoryRow(text: string): TableCell[] {
	return [
		{
			text: text,
			colSpan: 10,
			bold: true
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{}
	];
}

function generateFunctionIndicatorRow(indicator: Tables<'opcr_indicator'>): TableCell[] {
	return [
		{
			text: ''
		},
		{
			text: indicator.success_indicator
		},
		{
			text: indicator.alloted_budget
		},
		{
			text: indicator.division_individuals_accountable
		},
		{
			text: indicator.actual_accomplishments
		},
		{
			text: indicator.quality_rating
		},
		{
			text: indicator.efficiency_rating
		},
		{
			text: indicator.timeliness_rating
		},
		{
			text: indicator.average_rating
		},
		{
			text: indicator.remarks
		}
	];
}

function generateAverageFooter(): TableCell[][] {
	let context: TableCell[][] = [];
	const average = finalAverageRating / numberofIndicators;
	const adjectivalRating = [
		'Poor',
		'Unsatisfactory',
		'Satisfactory',
		'Very Satisfactory',
		'Outstanding'
	];
	context.push([
		{
			text: 'Average Rating',
			colSpan: 9,
			alignment: 'left',
			bold: true
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{
			text: average.toFixed(2)
		}
	]);
	context.push([
		{
			text: 'Adjectival Rating',
			colSpan: 9,
			bold: true,
			alignment: 'left'
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{
			text: adjectivalRating[Math.floor(average) - 1]
		}
	]);

	return context;
}
