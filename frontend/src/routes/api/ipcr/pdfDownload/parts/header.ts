import type { Content } from 'pdfmake/interfaces';

export const generateHeader = (logoBase64: string): Content => {
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
						text: 'INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)',
						bold: true,
						marginTop: 30
					}
				]
			]
		},
		style: 'header'
	};
};
