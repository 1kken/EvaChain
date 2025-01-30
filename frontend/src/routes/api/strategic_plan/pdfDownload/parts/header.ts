import type { Tables } from '$lib/types/database.types';
import type { Content } from 'pdfmake/interfaces';

export const generateHeader = (
	logoBase64: string,
	strategicPlan: Tables<'strategic_plan'>,
	objectives: Tables<'strat_plan_objective'>[]
): Content[] => {
	const MARGIN_TOP = 10;
	return [
		{
			table: {
				widths: ['*', '*'],
				heights: [30, 30],
				body: [
					[
						{
							image: `data:image/png;base64,${logoBase64}`,
							width: 70,
							height: 65,
							alignment: 'center'
						},
						{
							text: `Strategic Plan`,
							bold: true,
							marginTop: 30,
							alignment: 'center',
							fontSize: 13
						}
					]
				]
			}
		},
		{
			table: {
				widths: ['auto', '*'],
				body: [
					[
						{
							text: 'Title: ',
							bold: true
						},
						{
							text: strategicPlan.title
						}
					],
					[
						{
							text: 'Goal:',
							bold: true
						},
						{
							text: strategicPlan.goal
						}
					],
					[
						{
							text: 'Objectives:',
							bold: true,
							lineHeight: 1.5
						},
						{
							text: generateObjectiveText(objectives)
						}
					]
				]
			},
			marginTop: MARGIN_TOP
		}
	];
};

function generateObjectiveText(objectives: Tables<'strat_plan_objective'>[]) {
	let objectivesText = '';
	for (const [index, objective] of objectives.entries()) {
		objectivesText += `Objective ${index + 1}. ${objective.objective}\n`;
	}
	return objectivesText;
}
