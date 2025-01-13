import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '$lib/types/database.types';
import type { TableCell } from 'pdfmake/interfaces';
import { calculateColspan } from './ipcr_utils';
import { romanize } from 'romans';
import { fetchDataCategory, fetchDataFunction, getIndicatorsByParent } from '../helper';

export async function generateIPCRBody(
	functions: Tables<'ipcr_function'>[],
	ipcrId: string,
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const context: TableCell[][] = [];

	// Add each function's rows to the context
	context.push(...(await main(functions, supabase)));

	return context;
}

let currentIndexOfSubCategory = 0;
async function main(
	functions: Tables<'ipcr_function'>[],
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const rows: TableCell[][] = [];

	for (const [index, func] of functions.entries()) {
		rows.push(...generateFunction(func, index));

		const functionData = await fetchDataFunction(func.id, supabase);
		if (!functionData.success) {
			throw new Error('Failed to fetch data for function');
		}

		for (const data of functionData.data) {
			if (data.type === 'category') {
				rows.push(...generateCategory(data.data as Tables<'ipcr_function_category'>));
				const categoryData = await fetchDataCategory(data.data.id, supabase);
				if (!categoryData.success) {
					throw new Error('Failed to fetch data for category');
				}
				for (const categoryChildData of categoryData.data) {
					if (categoryChildData.type === 'sub-category') {
						rows.push(
							...generateSubCategory(
								categoryChildData.data as Tables<'ipcr_function_sub_category'>,
								currentIndexOfSubCategory
							)
						);
						currentIndexOfSubCategory += 1;
						const subCategoryIndicators = await getIndicatorsByParent(
							categoryChildData.id,
							'sub-category',
							supabase
						);
						for (const indicator of subCategoryIndicators.indicators) {
							rows.push(...generateIndicator(indicator));
						}
					} else {
						rows.push(...generateIndicator(categoryChildData.data as Tables<'ipcr_indicator'>));
					}
				}
			} else {
				rows.push(...generateIndicator(data.data as Tables<'ipcr_indicator'>));
			}
		}
	}

	return rows;
}

function generateFunction(func: Tables<'ipcr_function'>, index: number): TableCell[][] {
	const context: TableCell[][] = [];
	// Add function title as a row
	context.push([
		{
			text: `${romanize(index + 1)}. ${func.title}`,
			bold: true,
			colSpan: calculateColspan(func.title),
			alignment: 'left'
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
			alignment: 'left'
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
			alignment: 'left'
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
	// Add indicator title as a row
	context.push([
		{
			text: indicator.final_output,
			alignment: 'center'
		},
		{
			text: indicator.success_indicator,
			alignment: 'center'
		},
		{
			text: indicator.actual_accomplishments,
			alignment: 'center'
		},
		{
			text: indicator.quality_rating,
			alignment: 'center'
		},
		{
			text: indicator.efficiency_rating,
			alignment: 'center'
		},
		{
			text: indicator.timeliness_rating,
			alignment: 'center'
		},
		{
			text: indicator.average_rating,
			alignment: 'center'
		},
		{
			text: indicator.remarks,
			alignment: 'center'
		}
	]);

	return context;
}
