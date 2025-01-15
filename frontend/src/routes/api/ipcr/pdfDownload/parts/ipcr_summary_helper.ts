import type { Content, TableCell } from 'pdfmake/interfaces';
import type { CategoryStore } from './ipcr_utils';

export function generateIPCRSummary(categories: CategoryStore): Content {
	const TOTAL_FINAL_RATING_WIDTH = 20;
	const DEFUALT_WIDTH = 153;
	const MARGIN_TOP = 5;
	const context: Content = {
		unbreakable: true,
		margin: [0, 10, 0, 0],
		table: {
			headerRows: 1,
			widths: [
				DEFUALT_WIDTH,
				DEFUALT_WIDTH,
				DEFUALT_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				DEFUALT_WIDTH
			],
			body: [
				[
					{
						text: 'SUMMARY OF RATINGS',
						bold: true,
						alignment: 'center',
						colSpan: 5,
						marginTop: MARGIN_TOP
					},
					{},
					{},
					{},
					{},
					{
						text: 'TOTAL',
						bold: true,
						alignment: 'center',
						noWrap: true,
						fontSize: 7,
						marginTop: MARGIN_TOP
					},
					{
						text: 'FINAL\nRATING',
						bold: true,
						alignment: 'center',
						fontSize: 5,
						marginTop: MARGIN_TOP - 2
					},
					{
						text: 'FINAL ADJECTIVAL RATING',
						bold: true,
						alignment: 'center',
						marginTop: MARGIN_TOP
					}
				],
				...generateSummaryBody(categories)
			]
		}
	};
	// Add each function's rows to the context

	return context;
}

//this is for Grand Total
interface FunctionRating {
	finalRating: number; // The final rating for the function
	percentage: number; // The percentage associated with the function
}

function generateSummaryBody(categories: CategoryStore): TableCell[][] {
	const rows: TableCell[][] = [];
	const categoriesData = categories.getAll();
	const adjectivalRating = [
		'Poor',
		'Unsatisfactory',
		'Satisfactory',
		'Very Satisfactory',
		'Outstanding'
	];

	const grandTotal: FunctionRating[] = [];
	for (const functionName in categoriesData) {
		const functionData = categoriesData[functionName];
		const categories = functionData.categories;

		let weightedAverage = Object.entries(categories).reduce((acc, [_, value]) => {
			if ('category' in value) {
				return acc + value.total;
			}
			return acc + (value.total || 0);
		}, 0);

		let categoriesLength = Object.keys(categories).length;
		if (functionData.categories['total']) {
			grandTotal.push({
				finalRating: functionData.categories['total'].total,
				percentage: functionData.percentage
			});
		} else {
			grandTotal.push({
				finalRating: weightedAverage / categoriesLength,
				percentage: functionData.percentage
			});
		}

		let isFirst = true;
		for (const [categoryId, value] of Object.entries(categories)) {
			// If it's a category with units
			if ('category' in value) {
				//push for grand total
				rows.push([
					{ text: `${isFirst ? functionName : ''}` },
					{
						text: value.category,
						alignment: 'left',
						colSpan: 2,
						border: [true, true, false, true]
					},
					{},
					{
						text: `${value.units} units`,
						colSpan: 2,
						alignment: 'center',
						border: [false, true, true, true]
					},
					{},
					{ text: value.total.toFixed(2) },
					{
						text: `${(weightedAverage / categoriesLength).toFixed(2)}`,
						alignment: 'center',
						rowSpan: categoriesLength,
						marginTop: categoriesLength * 7
					},
					{}
				]);
			}
			// If it's just a total (no category)
			else if ('total' in value) {
				rows.push([
					{ text: functionName },
					{ text: '  ', border: [true, true, false, true], colSpan: 4 },
					{},
					{},
					{},
					{},
					{ text: value.total.toFixed(2) },
					{}
				]);
			}
			isFirst = false;
		}
		weightedAverage = 0;
	}

	const grandTotalValue = calculateGrandTotal(grandTotal);
	rows.push([
		{ text: 'Grand Total ', colSpan: 6 },
		{},
		{},
		{},
		{},
		{},
		{ text: grandTotalValue.toFixed(2), alignment: 'center' },
		{ text: adjectivalRating[Math.trunc(grandTotalValue) - 1], alignment: 'center' }
	]);

	// If no data, add a "No Data Available" row
	if (rows.length === 0) {
		rows.push([{ text: 'No Data Available', colSpan: 4, alignment: 'center' }, {}, {}, {}, {}]);
	}

	return rows;
}

function calculateGrandTotal(grandTotal: FunctionRating[]): number {
	const total = grandTotal.reduce((acc, { finalRating, percentage }) => {
		return acc + finalRating * (percentage / 100);
	}, 0);
	return 2.1;
}
