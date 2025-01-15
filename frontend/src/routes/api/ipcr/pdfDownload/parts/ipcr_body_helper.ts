import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '$lib/types/database.types';
import type { TableCell } from 'pdfmake/interfaces';
import { calculateColspan, CategoryStore, createCategoryStore, type Category } from './ipcr_utils';
import { romanize } from 'romans';
import { fetchDataCategory, fetchDataFunction, getIndicatorsByParent } from '../helper';
import { parse } from 'date-fns';

type BodyResult = {
	table: TableCell[][];
	categories: CategoryStore;
};

export async function generateIPCRBody(
	functions: Tables<'ipcr_function'>[],
	ipcrId: string,
	supabase: SupabaseClient<Database>
): Promise<BodyResult> {
	const context: TableCell[][] = [];
	// Add each function's rows to the context
	const { table, categories } = await main(functions, supabase);
	context.push(...table);

	return { table: context, categories: categories };
}

let currentIndexOfSubCategory = 0;

async function main(
	functions: Tables<'ipcr_function'>[],
	supabase: SupabaseClient<Database>
): Promise<BodyResult> {
	const categoryStore = createCategoryStore();
	const rows: TableCell[][] = [];

	for (const [index, func] of functions.entries()) {
		const averagePerIndicatorInFunction: number[] = [];
		const functionName = func.title;
		let currentCategoryId = '';
		let currentCategoryAverages: number[] = [];

		rows.push(...generateFunction(func, index));

		const functionData = await fetchDataFunction(func.id, supabase);
		if (!functionData.success) {
			throw new Error('Failed to fetch data for function');
		}

		for (const data of functionData.data) {
			if (data.type === 'category') {
				// If we have previous category data, calculate and update its total
				if (currentCategoryId && currentCategoryAverages.length > 0) {
					const categoryAverage =
						currentCategoryAverages.reduce((a, b) => a + b, 0) / currentCategoryAverages.length;
					const categories = categoryStore.getAll();
					if (categories[functionName]?.categories[currentCategoryId]) {
						const existingCategory = categories[functionName].categories[
							currentCategoryId
						] as Category;
						categoryStore.add(functionName, currentCategoryId, {
							...existingCategory,
							total: parseFloat(categoryAverage.toFixed(2))
						});
					}
				}

				const categoryData = data.data as Tables<'ipcr_function_category'>;
				currentCategoryId = categoryData.id;
				currentCategoryAverages = []; // Reset averages for new category

				// Add category to store
				categoryStore.add(functionName, categoryData.id, {
					category: categoryData.category,
					units: categoryData.unit?.toString() ?? '0',
					total: 0 // Will be updated after processing indicators
				});

				rows.push(...generateCategory(categoryData));

				const categoryChildren = await fetchDataCategory(categoryData.id, supabase);
				if (!categoryChildren.success) {
					throw new Error('Failed to fetch data for category');
				}

				for (const categoryChildData of categoryChildren.data) {
					if (categoryChildData.type === 'sub-category') {
						const subCategoryData = categoryChildData.data as Tables<'ipcr_function_sub_category'>;

						rows.push(...generateSubCategory(subCategoryData, currentIndexOfSubCategory));
						currentIndexOfSubCategory += 1;

						const subCategoryIndicators = await getIndicatorsByParent(
							categoryChildData.id,
							'sub-category',
							supabase
						);

						// Process subcategory indicators
						for (const indicator of subCategoryIndicators.indicators) {
							rows.push(...generateIndicator(indicator));
							const rating = indicator.average_rating ?? 0;
							averagePerIndicatorInFunction.push(rating);
							currentCategoryAverages.push(rating);
						}
					} else {
						const indicator = categoryChildData.data as Tables<'ipcr_indicator'>;
						rows.push(...generateIndicator(indicator));
						const rating = indicator.average_rating ?? 0;
						averagePerIndicatorInFunction.push(rating);
						currentCategoryAverages.push(rating);
					}
				}
			} else {
				const indicator = data.data as Tables<'ipcr_indicator'>;
				rows.push(...generateIndicator(indicator));
				averagePerIndicatorInFunction.push(indicator.average_rating ?? 0);
			}
		}

		// Calculate final category average if we have pending category data
		if (currentCategoryId && currentCategoryAverages.length > 0) {
			const categoryAverage =
				currentCategoryAverages.reduce((a, b) => a + b, 0) / currentCategoryAverages.length;
			const categories = categoryStore.getAll();
			if (categories[functionName]?.categories[currentCategoryId]) {
				const existingCategory = categories[functionName].categories[currentCategoryId] as Category;
				categoryStore.add(functionName, currentCategoryId, {
					...existingCategory,
					total: parseFloat(categoryAverage.toFixed(2))
				});
			}
		}

		// Handle functions without categories
		if (averagePerIndicatorInFunction.length > 0 && !categoryStore.getAll()[functionName]) {
			const average =
				averagePerIndicatorInFunction.reduce((a, b) => a + b, 0) /
				averagePerIndicatorInFunction.length;

			// For functions without categories, add them with a 'total' category
			categoryStore.add(functionName, 'total', {
				total: parseFloat(average.toFixed(2))
			});
		}

		// Set the percentage for the function based on its type
		categoryStore.setPercentage(functionName, func.percentage ?? 0);

		rows.push(...generateWeightedAverage(averagePerIndicatorInFunction));
	}

	currentIndexOfSubCategory = 0;
	rows.push(...generateNoteRow());

	return { table: rows, categories: categoryStore };
}

function generateFunction(func: Tables<'ipcr_function'>, index: number): TableCell[][] {
	const context: TableCell[][] = [];
	// Add function title as a row
	context.push([
		{
			text: `${romanize(index + 1)}. ${func.title}`,
			bold: true,
			colSpan: calculateColspan(func.title),
			alignment: 'left',
			headlineLevel: 1
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{} // Empty cells for colspan
	]);

	return context;
}
function generateCategory(category: Tables<'ipcr_function_category'>): TableCell[][] {
	const context: TableCell[][] = [];
	// Add category title as a row
	context.push([
		{
			text: `${category.category} ${category.unit} units`,
			bold: true,
			colSpan: calculateColspan(category.category),
			alignment: 'left',
			headlineLevel: 1
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{} // Empty cells for colspan
	]);

	return context;
}

function generateSubCategory(
	subCategory: Tables<'ipcr_function_sub_category'>,
	index: number
): TableCell[][] {
	const capitalLetters = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z'
	];
	const context: TableCell[][] = [];
	// Add sub-category title as a row
	context.push([
		{
			text: `${capitalLetters[index]}. ${subCategory.sub_category}`,
			bold: true,
			colSpan: calculateColspan(subCategory.sub_category),
			alignment: 'left',
			headlineLevel: 1
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{} // Empty cells for colspan
	]);

	return context;
}

function generateIndicator(indicator: Tables<'ipcr_indicator'>): TableCell[][] {
	const context: TableCell[][] = [];
	const marginTop = 5;
	// Add indicator title as a row
	context.push([
		{
			text: indicator.final_output,
			alignment: 'left',
			marginTop: marginTop
		},
		{
			text: indicator.success_indicator,
			alignment: 'left',
			marginTop: marginTop
		},
		{
			text: indicator.actual_accomplishments,
			alignment: 'left',
			marginTop: marginTop
		},
		{
			text: indicator.quality_rating,
			alignment: 'left',
			marginTop: marginTop
		},
		{
			text: indicator.efficiency_rating,
			alignment: 'left',
			marginTop: marginTop
		},
		{
			text: indicator.timeliness_rating,
			alignment: 'left',
			marginTop: marginTop
		},
		{
			text: indicator.average_rating,
			alignment: 'left',
			marginTop: marginTop
		},
		{
			text: indicator.remarks,
			alignment: 'left',
			marginTop: marginTop
		}
	]);

	return context;
}

function generateWeightedAverage(averagePerIndicator: number[]) {
	const row: TableCell[][] = [];
	row.push([
		{
			text: 'Weighted Average',
			alignment: 'right',
			colSpan: 6
		},
		{},
		{},
		{},
		{},
		{},
		{
			text: (averagePerIndicator.reduce((a, b) => a + b, 0) / averagePerIndicator.length).toFixed(
				2
			),
			bold: true,
			alignment: 'center'
		},
		{}
	]);
	return row;
}

function generateNoteRow() {
	const row: TableCell[][] = [];
	row.push([
		{
			text: [
				{ text: 'Note: ' },
				{ text: '1', fontSize: 8, sup: true },
				{ text: 'Quality  ' },
				{ text: '2', fontSize: 8, sup: true },
				{ text: 'Efficiency  ' },
				{ text: '3', fontSize: 8, sup: true },
				{ text: 'Timeliness  ' },
				{ text: '4', fontSize: 8, sup: true },
				{ text: 'Average' }
			],
			marginTop: 10,
			colSpan: 8,
			alignment: 'left'
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{}
	]);
	return row;
}
