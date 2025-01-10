import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'lucide-svelte';
import type { Tables } from '$lib/types/database.types';
import { titleCase } from 'title-case';

//UTILS
interface ProfileResult {
	profile:
		| (Tables<'profiles'> & {
				office: Tables<'office'>;
				unit: Tables<'unit'>;
				position: Tables<'position'>;
				employee_status: Tables<'employee_status'>;
				program: Tables<'program'>;
		  })
		| null;
	profileError: PostgrestError | null;
}

export async function fetchProfile(
	owner_id: string,
	supabase: SupabaseClient<Database>
): Promise<ProfileResult> {
	const { data, error } = await supabase
		.from('profiles')
		.select(
			`
            *,
            office:office_id(*),
            unit:unit_id(*),
            position:position_id(*),
            employee_status:employee_status_id(*),
            program:program_id(*)
        `
		)
		.eq('id', owner_id)
		.single();

	return {
		profile: data,
		profileError: error
	};
}

export async function fetchIPCR(ipcrId: string, supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase.from('ipcr').select().eq('id', ipcrId).single();

	return { ipcr: data, ipcrError: error };
}

//title case
export function generateFullName(profile: Tables<'profiles'>): string {
	const { first_name, middle_name, last_name } = profile;
	return titleCase(`${first_name} ${middle_name ?? ''} ${last_name}`);
}

export function formatSemesterRange(isoDateString: string): string {
	const date = new Date(isoDateString);
	const year = date.getFullYear();
	const month = date.getMonth(); // 0-11

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	// First or second semester
	if (month <= 5) {
		// January-June
		return `${months[0]}-${months[5]} ${year}`;
	} else {
		// July-December
		return `${months[6]}-${months[11]} ${year}`;
	}
}

export interface SupervisorWithPosition {
	id: string;
	fullName: string;
	position: string | null;
}

export async function fetchIPCRImmediateSupervisors(
	ipcrId: string,
	supabase: SupabaseClient<Database>
): Promise<SupervisorWithPosition[]> {
	const { data, error } = await supabase
		.from('ipcr_supervisors')
		.select('id, full_name, position')
		.eq('ipcr_id', ipcrId);

	if (error) {
		throw new Error(`Error fetching supervisors: ${error.message}`);
	}

	return (data ?? []).map((supervisor) => ({
		id: supervisor.id,
		fullName: supervisor.full_name,
		position: supervisor.position
	}));
}
interface SignatureBlockProps {
	fullName: string;
	position: string | null;
	label?: string;
}

export function createSignatureBlock({
	fullName,
	position,
	label = 'Reviewed by:'
}: SignatureBlockProps) {
	return {
		width: 'auto',
		table: {
			widths: [80, 'auto', '*', '*'],
			body: [
				[{ text: label, colSpan: 4, alignment: 'left' }, {}, {}, {}],
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
			fontSize: 11
		},
		layout: {
			defaultBorder: false
		}
	};
}
