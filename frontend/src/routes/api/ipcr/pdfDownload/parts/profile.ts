import { titleCase } from 'title-case';
import type { Tables } from '$lib/types/database.types';
import { formatSemesterRange, type Profile, type ProfileResult } from '../helper';
import type { Content } from 'pdfmake/interfaces';

export const generateProfile = (
	profile: Profile,
	fullName: string,
	ipcr: Tables<'ipcr'>
): Content => {
	return {
		text: [
			{ text: '\u200B\tI, ', bold: true },
			{ text: fullName + ', ', bold: true, decoration: 'underline' },
			{
				text: titleCase(profile!.position!.name),
				bold: true,
				decoration: 'underline'
			},
			{ text: '\u0020of the ', fontSize: 12 },
			{
				text: profile?.program?.name ?? profile?.office?.name ?? '',
				bold: true,
				decoration: 'underline'
			},
			{
				text: ', Don Mariano Marcos Memorial State University - ' + profile!.unit!.name,
				bold: true,
				decoration: 'underline'
			},
			{
				text: ' commit to deliver and agree to be rated on the attainment of the following targets in accordance with the indicated measures for the period '
			},
			{
				text: formatSemesterRange(ipcr.created_at),
				bold: true,
				decoration: 'underline'
			},
			{ text: '.' }
		],
		style: {
			fontSize: 10
		},
		margin: [0, 10]
	};
};
