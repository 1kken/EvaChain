import type { Content } from 'pdfmake/interfaces';

export const generateHeader = (logoBase64: string, period: number, year: number): Content => {
	return {
		table: {
			widths: ['*', 'auto'],
			heights: [30, 30],
			body: [
				[
					{
						image: `data:image/png;base64,${logoBase64}`,
						width: 70,
						height: 65
					},
					{
						text: [
							{
								text: 'Individual Performance Commitment and Review (IPCR) Performance Summary\n',
								fontSize: 12
							},
							{ text: `Semester ${period} - Year ${year}\n`, fontSize: 10 }
						],

						bold: true,
						marginTop: 30
					}
				]
			]
		},
		style: 'header'
	};
};
