import type { Content } from 'pdfmake/interfaces';

export const generateHeader = (
	logoBase64: string,
	margin_per_elemet: number,
	implimentingUnit: string,
	createdAt: string
): Content[] => {
	const date = new Date(createdAt);
	const currentYear = date.getFullYear();
	const nextYear = currentYear + 1;
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
							text: [
								{ text: 'ACCOMPLISHMENT REPORT CY ' },
								{ text: currentYear.toString(), decoration: 'underline' }
							],
							marginTop: 30,
							alignment: 'center',
							fontSize: 16
						}
					]
				]
			}
		},
		{
			text: [
				{
					text: `Office/Unit: `
				},
				{ text: implimentingUnit.toUpperCase(), decoration: 'underline' }
			],
			alignment: 'left',
			marginTop: margin_per_elemet
		}
	];
};
