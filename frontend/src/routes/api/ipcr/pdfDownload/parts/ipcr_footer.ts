import type { Tables } from '$lib/types/database.types';
import type { Content } from 'pdfmake/interfaces';
import { generateFullName, type Profile } from '../helper';

export function generateFooter(ipcr: Tables<'ipcr'>, profile: Profile): Content {
	const TOTAL_FINAL_RATING_WIDTH = 20;
	const DEFUALT_WIDTH = 153;
	const MARGIN_LEFT = 5;

	const programChairText = ipcr.program_chair ? 'Program Chair' : '';

	const positionRoleText = ipcr.dean
		? 'Dean'
		: ipcr.immediate_supervisor
			? 'Immediate Supervisor'
			: 'Dean/Director/Immediate Supervisor';

	const fullName = generateFullName(profile);

	const facultyStaffText = (() => {
		const type = profile.nature_of_work?.type || '';
		if (/non[\s-]teaching/i.test(type)) return 'Staff';
		if (/teaching/i.test(type)) return 'Faculty';
		return 'Faculty/Staff';
	})();

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
				[{ text: 'Signature', colSpan: 8 }, {}, {}, {}, {}, {}, {}, {}],
				[
					{ text: 'Name' },
					{
						text: ipcr.program_chair ? ipcr.program_chair.toUpperCase() : '',
						alignment: 'center',
						decoration: 'underline'
					},
					{
						text: ipcr.dean?.toUpperCase() || ipcr.immediate_supervisor?.toUpperCase() || '',
						alignment: 'center',
						decoration: 'underline'
					},
					{
						text: fullName.toUpperCase(),
						alignment: 'center',
						colSpan: 4,
						decoration: 'underline'
					},
					{},
					{},
					{},
					{
						text: ipcr.head_of_operating_unit?.toUpperCase() || '',
						alignment: 'center',
						decoration: 'underline'
					}
				],
				[
					{ text: 'Position' },
					{
						text: programChairText,
						alignment: 'center'
					},
					{
						text: positionRoleText,
						alignment: 'center'
					},
					{
						text: facultyStaffText,
						alignment: 'center',
						colSpan: 4
					},
					{},
					{},
					{},
					{
						text: 'Head of Operating Unit',
						alignment: 'center'
					}
				],
				[{ text: 'Date' }, {}, {}, {}, {}, {}, {}, {}]
			]
		},
		layout: {
			defaultBorder: false
		}
	};

	return context;
}
