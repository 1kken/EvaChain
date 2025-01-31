import type { Content } from 'pdfmake/interfaces';
import { generateFullName, type Profile } from '../helper';

export function generateBottomSignature(profile: Profile): Content {
	return [
		{
			table: {
				widths: [50, 'auto', 'auto', 'auto'],
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
							text: '',
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
	];
}
