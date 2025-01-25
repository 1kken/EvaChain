import type { Content, TableCell } from 'pdfmake/interfaces';

export function generateComments(): Content {
	const TOTAL_FINAL_RATING_WIDTH = 20;
	const DEFUALT_WIDTH = 153;
	const context: Content = {
		unbreakable: true,
		margin: [0, 10, 0, 0],
		table: {
			headerRows: 1,
			widths: [
				DEFUALT_WIDTH,
				DEFUALT_WIDTH,
				DEFUALT_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				DEFUALT_WIDTH
			],
			body: [
				[
					{
						text: "Rater's comment and recommendations for development purposes, rewards/promotions:",
						fontSize: 8,
						bold: true,
						alignment: 'left',
						colSpan: 2
					},
					{},
					{
						text: 'Disposition of the next higher supervisor:',
						fontSize: 8,
						bold: true,
						alignment: 'left'
					},
					{
						text: [
							{ text: 'O I accept the rating given\n O I reject the rating given\n' },
							{ text: 'Comments:', bold: true }
						],
						colSpan: 3
					},
					{},
					{},
					{ text: 'Approved:', colSpan: 2 },
					{}
				],
				...generateExtraSpace()
			]
		}
	};
	return context;
}

function generateExtraSpace(): TableCell[][] {
	const emptyRows: TableCell[][] = [];
	for (let i = 0; i < 5; i++) {
		if (i === 4) {
			emptyRows.push([
				{ text: '', colSpan: 2 },
				{},
				{},
				{ text: '    ', colSpan: 3, border: [true, false, true, true] },
				{},
				{},
				{ text: '', colSpan: 2, border: [true, false, true, true] },
				{}
			]);
			break;
		}
		emptyRows.push([
			{ text: '', colSpan: 2 },
			{},
			{},
			{ text: '    ', colSpan: 3, border: [true, false, true, false] },
			{},
			{},
			{ text: '', colSpan: 2, border: [true, false, true, false] },
			{}
		]);
	}

	return emptyRows;
}
