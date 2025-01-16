import type { Tables } from '$lib/types/database.types';
import type { Content, Table } from 'pdfmake/interfaces';
import type { Profile } from '../helper';
import { titleCase } from 'title-case';

export function generateFooter(profile: Profile, op: Tables<'operational_plan'>): Content {
	const org = profile.office?.name || profile.unit?.name || '';
	return {
		marginTop: 10,
		columnGap: 10,
		columns: [
			createSignatureBlock(
				generateFullName(profile),
				profile.position?.name || '',
				org,
				'Prepared by:'
			)
		]
	};
}

export function generateFullName(profile: Tables<'profiles'>): string {
	const { first_name, middle_name, last_name } = profile;
	console.log(first_name, middle_name, last_name);
	return `${first_name} ${middle_name ?? ''} ${last_name}`.toUpperCase();
}
export function createSignatureBlock(
	fullName: string,
	position: string,
	org: string,
	header: string
): Content {
	return {
		table: {
			widths: ['auto', 'auto'],
			body: [
				[
					{ text: 'Signature', alignment: 'left' },
					{
						text: '',
						border: [false, false, false, false],
						margin: [0, 0, 0, 0]
					}
				],
				[
					{ text: '' },
					{
						text: fullName.toUpperCase(),
						alignment: 'center',
						border: [false, false, false, true],
						bold: true,
						marginTop: 5
					}
				],
				[
					{ text: '' },
					{
						text: titleCase(position) + ', ' + titleCase(org),
						alignment: 'center',
						border: [false, false, false, true],
						bold: true,
						marginBottom: 10
					}
				],
				[
					{ text: '' },
					{
						text: 'Date',
						border: [false, true, false, false],
						alignment: 'center',
						marginTop: 0,
						bold: true
					}
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
