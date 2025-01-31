import type { Content, ContentTable } from 'pdfmake/interfaces';

export function createSignatureBlock(fullName: string, position: string): ContentTable {
	const context: Content = {
		table: {
			widths: [10, 'auto', 'auto', 'auto'],
			body: [
				[
					{ text: '' },
					{ text: 'Reviewed by: \nSignature', alignment: 'left' },
					{
						text: '',
						border: [false, false, false, true],
						colSpan: 2,
						margin: [0, 0, 0, 0]
					},
					{}
				],
				[
					{ text: '' },
					{ text: 'Name', alignment: 'left' },
					{
						text: fullName.toUpperCase(),
						alignment: 'center',
						border: [false, false, false, true],
						colSpan: 2,
						bold: true,
						margin: [0, 0, 0, 0]
					},
					{}
				],
				[
					{ text: '' },
					{ text: 'Position', alignment: 'left' },
					{
						text: (position || '').toUpperCase(),
						alignment: 'center',
						border: [false, false, false, true],
						colSpan: 2,
						bold: true,
						margin: [0, 0, 0, 0]
					},
					{}
				],
				[
					{ text: '' },
					{ text: 'Date', alignment: 'left' },
					{
						text: '',
						border: [false, false, false, true],
						colSpan: 2,
						bold: true,
						margin: [0, 0, 0, 0]
					},
					{}
				]
			]
		},
		marginTop: 10,
		style: {
			fontSize: 8
		},
		layout: {
			defaultBorder: false
		}
	};
	return context;
}
