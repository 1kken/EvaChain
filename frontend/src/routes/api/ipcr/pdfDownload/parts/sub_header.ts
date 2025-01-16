import type { Column, Content, ContentColumns } from 'pdfmake/interfaces';
import { generateFullName, type Profile, type ProfileResult } from '../helper';

export const generateSubHeader = (date: string, profile: Profile): ContentColumns => {
	return {
		columns: [
			{
				width: 'auto',
				table: {
					widths: [150, 150, 150],
					heights: [10, 10],
					body: [
						[
							{
								text: 'Ratings',
								bold: true
							},
							{ text: 'Range', bold: true },
							{ text: 'Adjectival Ratings', bold: true }
						],
						[{ text: '5' }, { text: '130% and above' }, { text: 'Outstanding' }],
						[{ text: '4' }, { text: '115% - 129%' }, { text: 'Very Satisfactory' }],
						[{ text: '3' }, { text: '90% - 114%' }, { text: 'Satisfactory' }],
						[{ text: '2' }, { text: '51% - 89%' }, { text: 'Unsatisfactory' }],
						[{ text: '1' }, { text: '50% and below' }, { text: 'Poor' }]
					]
				},
				style: 'ratings',
				layout: {
					hLineWidth: function (i, node) {
						return i === 0 || i === node.table.body.length ? 1 : 0;
					},
					vLineWidth: function (i, node) {
						return i === 0 || (node.table.widths && i === node.table.widths.length) ? 1 : 0;
					}
				}
			},
			{
				table: {
					widths: [50, 'auto', '*', '*'],
					body: [
						[{ text: 'Prepared by:', colSpan: 4, alignment: 'left' }, {}, {}, {}],
						[
							{ text: '' },
							{ text: 'Signature', alignment: 'left' },
							{
								text: '',
								alignment: 'justify',
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
								text: generateFullName(profile!).toUpperCase(),
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
								text: profile!.position!.name.toUpperCase(),
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
								text: date.toUpperCase(),
								alignment: 'center',
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
					defaultBorder: false,
					paddingLeft: function (i, node) {
						return 0;
					},
					paddingRight: function (i, node) {
						return 0;
					}
				}
			}
		],
		columnGap: 50
	};
};
