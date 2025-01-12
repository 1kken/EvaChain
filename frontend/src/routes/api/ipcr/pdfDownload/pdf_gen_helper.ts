interface SignatureBlockProps {
	fullName: string;
	position: string | null;
	label?: string;
}

export function createSignatureBlock({ fullName, position }: SignatureBlockProps) {
	return {
		width: 'auto',
		table: {
			widths: [10, 'auto', '*', '*'],
			body: [
				[
					{ text: '' },
					{ text: 'Signature', alignment: 'left' },
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
		style: {
			fontSize: 8
		},
		layout: {
			defaultBorder: false
		}
	};
}

export function createIPCRTable() {
	return {
		width: 'auto',
		table: {
			widths: ['*', '*', '*', '*', '*', '*'],
			body: [
				[
					{ text: 'No.', bold: true, alignment: 'center' },
					{ text: 'Key Result Areas', bold: true, alignment: 'center' },
					{ text: 'Objectives', bold: true, alignment: 'center' },
					{ text: 'Measures', bold: true, alignment: 'center' },
					{ text: 'Actual Accomplishments', bold: true, alignment: 'center' },
					{ text: 'Rating', bold: true, alignment: 'center' }
				],
				[
					{ text: '1', alignment: 'center' },
					{ text: '2', alignment: 'center' },
					{ text: '3', alignment: 'center' },
					{ text: '4', alignment: 'center' },
					{ text: '5', alignment: 'center' },
					{ text: '6', alignment: 'center' }
				]
			]
		},
		style: {
			fontSize: 8
		},
		layout: {
			defaultBorder: false
		}
	};
}
