import type { Content, TableCell } from 'pdfmake/interfaces';
import type { PerformanceSummaryWithDerivedData } from '../helper';
import { titleCase } from 'title-case';

export const generateBody = (performanceSummary: PerformanceSummaryWithDerivedData[]): Content => {
	return {
		stack: [
			{
				margin: [0, 20, 0, 0], // [left, top, right, bottom]
				table: {
					widths: ['auto', '*', 'auto', 'auto'],
					heights: [30, 30],
					headerRows: 1,
					body: [
						[
							{ text: 'Employee ID', style: 'header', alignment: 'center', fontSize: 12 },
							{ text: 'Name', style: 'header', alignment: 'center', fontSize: 12 },
							{ text: 'Weighted Average', style: 'header', alignment: 'center', fontSize: 12 },
							{ text: 'Interpretation', style: 'header', alignment: 'center', fontSize: 12 }
						],
						...main(performanceSummary)
					]
				}
			}
		]
	};
};

/**
 * Gets the interpretation based on weighted average
 * @param rating - The weighted average rating
 * @returns The interpretation text
 */
function getInterpretation(rating: number): string {
	if (rating >= 4.9) return 'Outstanding';
	if (rating >= 4.0) return 'Very Satisfactory';
	if (rating >= 3.0) return 'Satisfactory';
	if (rating >= 2.0) return 'Fair';
	return 'Poor';
}

function main(performanceSummary: PerformanceSummaryWithDerivedData[]): TableCell[][] {
	const rows: TableCell[][] = [];

	for (const summary of performanceSummary) {
		// Correctly format the full name
		const firstName = summary.owner?.first_name || '';
		const middleName = summary.owner?.middle_name ? ` ${summary.owner.middle_name}` : '';
		const lastName = summary.owner?.last_name ? ` ${summary.owner.last_name}` : '';
		const fullName = titleCase(firstName + middleName + lastName);

		// Get interpretation based on weighted average
		const weightedAverage = summary.weighted_average;
		const interpretation = getInterpretation(weightedAverage ?? 0);

		rows.push([
			{ text: summary.owner?.employee_id || '', alignment: 'center', fontSize: 12, marginTop: 10 },
			{ text: titleCase(fullName), alignment: 'left', fontSize: 12, marginTop: 10 },
			{ text: weightedAverage, alignment: 'center', fontSize: 12, marginTop: 10 },
			{ text: interpretation, alignment: 'center', fontSize: 12, marginTop: 10 }
		]);
	}
	return rows;
}
