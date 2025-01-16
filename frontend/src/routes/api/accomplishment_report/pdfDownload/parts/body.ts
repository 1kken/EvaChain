import type { Database, Tables } from '$lib/types/database.types';
import type { Content, TableCell } from 'pdfmake/interfaces';
import { fetchAccomplishmentMetricsById } from '../helper';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function generateBody(
	programProject: Tables<'accomplishment_program_project'>[],
	supabase: SupabaseClient<Database>
): Promise<Content> {
	const ratingWidth = 50;
	const context: Content = {
		marginTop: 10,
		table: {
			//17 cols
			widths: [
				'*',
				'*',
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth,
				'auto',
				'*'
			],
			headerRows: 1,
			body: [
				[
					{ text: 'Project/Program', style: 'header' },
					{ text: 'Metrics', style: 'header' },
					{ text: 'Former State', style: 'header' },
					{ text: 'Annual State', style: 'header' },
					{
						colSpan: 5,
						stack: [
							{
								text: 'Actual Accomplishment',
								style: 'header',
								bold: true,
								alignment: 'center'
							},
							{
								marginTop: 10,
								table: {
									widths: ['*', '*', '*', '*', '*'],
									body: [
										[
											{
												text: '1st Quarter',
												alignment: 'center',
												border: [false, true, true, false]
											},
											{
												text: '2nd Quarter',
												alignment: 'center',
												border: [false, true, true, false]
											},
											{
												text: '3rd Quarter',
												alignment: 'center',
												border: [false, true, true, false]
											},
											{
												text: '4th Quarter',
												alignment: 'center',
												border: [false, true, true, false]
											},
											{
												text: 'Total',
												alignment: 'center',
												border: [false, true, false, false]
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
					{},
					{ text: 'Variance', style: 'header' },
					{ text: 'Remarks', style: 'header' }
				],
				...(await generateMainBody(programProject, supabase))
			]
		}
	};
	return context;
}

async function generateMainBody(
	programProject: Tables<'accomplishment_program_project'>[],
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const rows: TableCell[][] = [];

	for (const project of programProject) {
		rows.push([
			{ text: `${project.program_project}`, colSpan: 11, bold: true, fontSize: 9 },
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{}
		]);

		const metrics = await fetchAccomplishmentMetricsById(project.id, supabase);
		rows.push(...generateMetrics(metrics));
	}
	return rows;
}

export function generateMetrics(metrics: Tables<'accomplishment_metrics'>[]): TableCell[][] {
	const rows: TableCell[][] = [];
	for (const metric of metrics) {
		rows.push([
			{},
			{ text: `${metric.metrics}` },
			{ text: metric.former_state, alignment: 'center' },
			{ text: metric.annual_target, alignment: 'center' },
			{ text: metric.quarter_1_accomplishment, alignment: 'center' },
			{ text: metric.quarter_2_accomplishment, alignment: 'center' },
			{ text: metric.quarter_3_accomplishment, alignment: 'center' },
			{ text: metric.quarter_4_accomplishment, alignment: 'center' },
			{ text: metric.total_accomplishment, alignment: 'center' },
			{ text: metric.variance, alignment: 'center' },
			{ text: metric.remarks }
		]);
	}
	return rows;
}
