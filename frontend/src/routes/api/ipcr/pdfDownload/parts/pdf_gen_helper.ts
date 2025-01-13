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
