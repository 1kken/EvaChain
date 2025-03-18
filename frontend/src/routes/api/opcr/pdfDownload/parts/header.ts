import type { Content } from 'pdfmake/interfaces';
import { formatSemesterRange, generateFullName, type Profile } from '../helper';
import type { Tables } from '$lib/types/database.types';
import { titleCase } from 'title-case';

export const generateHeader = (
	logoBase64: string,
	dpcr: Tables<'dpcr'>,
	profile: Profile
): Content[] => {
	const date = new Date(dpcr.created_at);
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
							text: `OFFICE PERFORMANCE COMMITMENT AND REVIEW (OPCR)`,
							bold: true,
							marginTop: 30,
							alignment: 'center',
							fontSize: 13
						}
					]
				]
			}
		},
		{
			text: [
				{ text: '\u200B\tI, ', bold: true },
				{ text: generateFullName(profile) + ', ', bold: true, decoration: 'underline' },
				{
					text: titleCase(profile!.position!.name),
					bold: true,
					decoration: 'underline'
				},
				{ text: '\u0020of the ', fontSize: 12 },
				{
					text: profile!.office!.name + ', ',
					bold: true,
					decoration: 'underline'
				},
				{
					text: profile!.unit!.name,
					bold: true,
					decoration: 'underline'
				},
				{
					text: ' commit to deliver and agree to be rated on the attainment of the following targets in accordance with the indicated measures for the period '
				},
				{
					text: formatSemesterRange(dpcr.created_at),
					bold: true,
					decoration: 'underline'
				},
				{ text: '.' }
			],
			style: {
				fontSize: 10
			},
			margin: [0, 10]
		}
	];
};
