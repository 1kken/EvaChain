import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { titleCase } from 'title-case';

export async function fetchDPCRById(supabase: SupabaseClient<Database>, id: string) {
	const { data, error: fetchError } = await supabase.from('dpcr').select('*').eq('id', id).single();
	if (fetchError) {
		error(500, { message: 'Failed to fetch DPCR' });
	}
	return data;
}

export async function fetchDpcrFunctionsByDpcrId(
	supabase: SupabaseClient<Database>,
	dpcr_id: string
) {
	const { data, error: fetchError } = await supabase
		.from('dpcr_function')
		.select('*')
		.eq('dpcr_id', dpcr_id)
		.order('position', { ascending: true });
	if (fetchError) {
		error(500, { message: 'Failed to fetch DPCR functions' });
	}
	return data;
}
type FlattenedItem = {
	id: string;
	type: 'category' | 'indicator';
	position: number;
	data: Tables<'dpcr_indicator'> | Tables<'dpcr_function_category'>;
};

export async function fetchDpcrIndicatorsByCategoryId(
	categoryId: string,
	supabase: SupabaseClient<Database>
) {
	const { data, error: fetchError } = await supabase
		.from('dpcr_indicator')
		.select('*')
		.eq('dpcr_function_category_id', categoryId)
		.order('position', { ascending: true });
	if (fetchError) {
		error(500, { message: 'Failed to fetch DPCR indicators' });
	}
	return data;
}

export async function fetchAssessorByDpcrId(supabase: SupabaseClient<Database>, dpcr_id: string) {
	const { data, error: fetchError } = await supabase
		.from('dpcr_assessor')
		.select('*')
		.eq('dpcr_id', dpcr_id)
		.order('position', { ascending: true });
	if (fetchError) {
		error(500, { message: 'Failed to fetch DPCR assessors' });
	}
	return data;
}

export async function fetchDataFunction(functionId: string, supabase: SupabaseClient<Database>) {
	try {
		const [categoriesResult, indicatorsResult] = await Promise.all([
			supabase
				.from('dpcr_function_category')
				.select('*')
				.eq('dpcr_function_id', functionId)
				.order('position'),

			supabase
				.from('dpcr_indicator')
				.select('*')
				.eq('dpcr_function_id', functionId)
				.is('dpcr_function_category_id', null)
				.order('position')
		]);

		if (categoriesResult.error || indicatorsResult.error) {
			error(500, { message: 'Error fetching data' });
		}

		const categoriesWithType: FlattenedItem[] = categoriesResult.data.map((category) => ({
			id: category.id,
			type: 'category',
			position: category.position,
			data: category
		}));

		const indicatorsWithType: FlattenedItem[] = indicatorsResult.data.map((indicator) => ({
			id: indicator.id,
			type: 'indicator',
			position: indicator.position,
			data: indicator
		}));

		const combinedItems = [...categoriesWithType, ...indicatorsWithType].sort((a, b) => {
			if (a.position !== b.position) return a.position - b.position;
			if (a.type !== b.type) return a.type === 'category' ? -1 : 1;
			return a.id.localeCompare(b.id);
		});

		return combinedItems;
	} catch (e) {
		error(500, { message: 'Error fetching data' });
	}
}

export interface Profile extends Tables<'profiles'> {
	office: Tables<'office'> | null;
	unit: Tables<'unit'> | null;
	position: Tables<'position'> | null;
	employee_status: Tables<'employee_status'> | null;
	program: Tables<'program'> | null;
	nature_of_work: Tables<'nature_of_work'> | null; // Added this line
}

export interface ProfileResult {
	profile: Profile | null;
	profileError: Error | null;
}

export async function fetchProfile(
	supabase: SupabaseClient<Database>,
	owner_id: string
): Promise<ProfileResult> {
	const { data, error } = await supabase
		.from('profiles')
		.select(
			`
      *,
      unit!unit_id (*),
      office!office_id (*),
      position!position_id (*),
      employee_status!employee_status_id (*),
      program!program_id (*),
      nature_of_work!nature_of_work_id (*)
    `
		)
		.eq('id', owner_id)
		.single();

	// Transform the response to match our expected types
	const transformedData = data
		? {
				...data,
				unit: data.unit || null,
				office: data.office || null,
				position: data.position || null,
				employee_status: data.employee_status || null,
				program: data.program || null,
				nature_of_work: data.nature_of_work || null // Added this line
			}
		: null;

	return {
		profile: transformedData as Profile | null,
		profileError: error
	};
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

export function generateFullName(profile: Tables<'profiles'>): string {
	const { first_name, middle_name, last_name } = profile;
	return titleCase(`${first_name} ${middle_name ?? ''} ${last_name}`);
}
