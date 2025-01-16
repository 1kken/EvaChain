import type { Database, Tables } from '$lib/types/database.types';
import type { Content, TableCell } from 'pdfmake/interfaces';
import {
	fetchOpActivitiesByOpObjectiveId,
	fetchOpHeadersByOPId,
	fetchOpObjectivesByOpProgramProjectId,
	fetchOpProgramProjectByOpHeaderId
} from './op_body_helper';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function generateOpBody(
	op: Tables<'operational_plan'>,
	supabase: SupabaseClient<Database>
): Promise<Content> {
	const ratingWidth = 20;
	const opHeaders = await fetchOpHeadersByOPId(op.id, supabase);
	const cotext: Content = {
		marginTop: 10,
		table: {
			//17 cols
			widths: [
				'*',
				'*',
				'*',
				'*',
				'*',
				'*',
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth,
				'auto',
				ratingWidth,
				ratingWidth,
				ratingWidth,
				'auto',
				'auto',
				'auto'
			],
			headerRows: 1,
			body: [
				[
					{ text: 'Program/project', style: 'header' },
					{ text: 'Objectives', style: 'header' },
					{ text: 'Activities', style: 'header' },
					{ text: 'Performance Indicator', style: 'header' },
					{ text: 'Former State', style: 'header' },
					{ text: 'Desired State\n(Target)', style: 'header' },
					{
						colSpan: 4,
						stack: [
							{
								text: 'Time Frame',
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
					{
						colSpan: 4,
						stack: [
							{
								text: 'Budgetary Requirements',
								style: 'header',
								bold: true,
								alignment: 'center'
							},
							{
								table: {
									widths: ['*', '*', '*', '*'],
									body: [
										[
											{
												text: 'Item',
												alignment: 'center',
												border: [false, true, true, false]
											},
											{
												text: 'Qty',
												alignment: 'center',
												border: [true, true, true, false]
											},
											{
												text: 'Unit',
												alignment: 'center',
												border: [true, true, true, false]
											},
											{
												text: 'Unit Cost',
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
					{ text: 'Amount', style: 'header' },
					{ text: 'Fund Source', style: 'header' },
					{ text: 'Person/ Unit Resposnible', style: 'header' }
				],
				...(await main(opHeaders, supabase))
			]
		}
	};

	return cotext;
}

async function main(
	opHeaders: Tables<'op_header'>[],
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const rows: TableCell[][] = [];

	for (const opHeader of opHeaders) {
		rows.push(generateOpHeaderRow(opHeader.title));

		const opProgramProjects = await fetchOpProgramProjectByOpHeaderId(opHeader.id, supabase);
		for (const opProgramProject of opProgramProjects) {
			const opObjectives = await fetchOpObjectivesByOpProgramProjectId(
				opProgramProject.id,
				supabase
			);
			let isFirstProgramProject = true;
			for (const opObjective of opObjectives) {
				let isFirsObjective = true;
				const opActivities = await fetchOpActivitiesByOpObjectiveId(opObjective.id, supabase);
				for (const opActivity of opActivities) {
					rows.push(
						generateBodyRow({
							programProjectDescription: opProgramProject.description,
							objective: opObjective.objective,
							activity: opActivity,
							isFirstProgramProject,
							isFirsObjective
						})
					);
					isFirsObjective = false;
					isFirstProgramProject = false;
				}
				isFirstProgramProject = false;
			}
		}
	}
	return rows;
}

function generateOpHeaderRow(opHeader: string): TableCell[] {
	return [
		{
			text: opHeader,
			colSpan: 17
		},
		{},
		{},
		{},
		{},
		{},
		{},
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
	];
}

interface BodyRowParams {
	programProjectDescription: string;
	objective: string;
	activity: Tables<'op_activity'>;
	isFirstProgramProject: boolean;
	isFirsObjective: boolean;
}
function generateBodyRow(params: BodyRowParams): TableCell[] {
	return [
		{ text: params.isFirstProgramProject ? params.programProjectDescription : '' },
		{ text: params.isFirsObjective ? params.objective : '' },
		{ text: params.activity.activity },
		{ text: params.activity.indicator },
		{
			text: params.activity.former_state,
			alignment: 'center'
		},
		{
			text: params.activity.desired_state,
			alignment: 'center'
		},
		{ text: params.activity.q1, alignment: 'center' },
		{ text: params.activity.q2, alignment: 'center' },
		{ text: params.activity.q3, alignment: 'center' },
		{ text: params.activity.q4, alignment: 'center' },
		{ text: params.activity.item, alignment: 'center' },
		{ text: params.activity.qty, alignment: 'center' },
		{ text: params.activity.unit, alignment: 'center' },
		{ text: params.activity.unit_cost, alignment: 'center' },
		{ text: params.activity.amount, alignment: 'center' },
		{ text: params.activity.fund_source, alignment: 'center' },
		{ text: params.activity.entity_responsible }
	];
}
