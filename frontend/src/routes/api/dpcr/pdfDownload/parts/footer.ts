import type { Tables } from '$lib/types/database.types';
import type { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import { createSignatureBlock } from './review_by';

export function generateFooter(
	assessors: Tables<'dpcr_assessor'>[],
	dpcr: Tables<'dpcr'>
): Content {
	const TOTAL_FINAL_RATING_WIDTH = 20;
	const DEFUALT_WIDTH = 153;
	const context: Content = {
		unbreakable: true,
		margin: [0, 10, 0, 0],
		table: {
			headerRows: 1,
			widths: [
				'*',
				'*',
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				TOTAL_FINAL_RATING_WIDTH,
				DEFUALT_WIDTH
			],
			body: [
				...generateNoteRow(),
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
			{ text: '    ', colSpan: 3, border: [true, false, true, false] },
			{},
			{},
			{ text: '', colSpan: 2, border: [true, false, true, false] },
			{}
		]);
	}

	return emptyRows;
}

function generateNoteRow() {
	const row: TableCell[][] = [];
	row.push([
		{
			text: [
				{ text: 'Note: ' },
				{ text: '1', fontSize: 8, sup: true },
				{ text: 'Quality  ' },
				{ text: '2', fontSize: 8, sup: true },
				{ text: 'Efficiency  ' },
				{ text: '3', fontSize: 8, sup: true },
				{ text: 'Timeliness  ' },
				{ text: '4', fontSize: 8, sup: true },
				{ text: 'Average' }
			],
			marginTop: 10,
			colSpan: 7,
			alignment: 'left'
		},
		{},
		{},
		{},
		{},
		{},
		{}
	]);
	return row;
}

export function generateAssesorSignatureBlock(
	assessors: Tables<'dpcr_assessor'>[],
	dpcr: Tables<'dpcr'>
): Content {
	return {
		columns: [
			...assessors.map((assessor, index) => {
				return createSignatureBlockBottom(
					'Assessor',
					assessor.name.toLocaleUpperCase(),
					assessor.position
				);
			}),
			createSignatureBlockBottom('Approved', dpcr.review_by, dpcr.reviewer_position)
		],
		columnGap: 10,
		//horizontal,vertical
		margin: [0, 5]
	};
}
function createSignatureBlockBottom(
	head: string,
	fullName: string,
	position: string
): ContentTable {
	const context: Content = {
		table: {
			widths: [10, 'auto', 'auto', 'auto'],
			body: [
				[
					{ text: '' },
					{
						text: [{ text: `${head}: \n`, bold: true }, { text: 'Signature' }],
						alignment: 'left'
					},
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
