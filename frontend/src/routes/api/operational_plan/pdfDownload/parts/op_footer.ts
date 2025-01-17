import type { Tables } from '$lib/types/database.types';
import type { Content } from 'pdfmake/interfaces';
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
				'Prepared by:',
				titleCase(profile.position!.name) + ', ' + titleCase(org)
			),
			createSignatureBlock(
				op.head_of_planning.toUpperCase(),
				'Noted by:',
				'Head, Insititutional Planning and Futures Thinking'
			),
			createSignatureBlock(
				op.head_of_operating_unit.toUpperCase(),
				'Approved by:',
				'Head of Operating Unit'
			)
		]
	};
}

export function generateFullName(profile: Tables<'profiles'>): string {
	const { first_name, middle_name, last_name } = profile;
	console.log(first_name, middle_name, last_name);
	return `${first_name} ${middle_name ?? ''} ${last_name}`.toUpperCase();
}
export function createSignatureBlock(fullName: string, header: string, title: string): Content {
	return {
		unbreakable: true,
		table: {
			widths: ['auto', 'auto'],
			body: [
				[
					{ text: header, alignment: 'left' },
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
						text: title,
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
