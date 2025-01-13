import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '$lib/types/database.types';
import { titleCase } from 'title-case';

//UTILS
export interface Profile extends Tables<'profiles'> {
	office: Tables<'office'> | null;
	unit: Tables<'unit'> | null;
	position: Tables<'position'> | null;
	employee_status: Tables<'employee_status'> | null;
	program: Tables<'program'> | null;
}

export interface ProfileResult {
	profile: Profile | null;
	profileError: Error | null;
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
      unit!unit_id (*),
      office!office_id (*),
      position!position_id (*),
      employee_status!employee_status_id (*),
      program!program_id (*)
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
				program: data.program || null
			}
		: null;

	return {
		profile: transformedData as Profile | null,
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

	// Filter out any entries with null id or full_name and transform the data
	return (data ?? [])
		.filter(
			(supervisor): supervisor is { id: string; full_name: string; position: string | null } => {
				return supervisor.id != null && supervisor.full_name != null;
			}
		)
		.map((supervisor) => ({
			id: supervisor.id,
			fullName: supervisor.full_name,
			position: supervisor.position
		}));
}

//FOR IPCR
export async function getIPCRFunctionsById(id: string, supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from('ipcr_function')
		.select()
		.eq('ipcr_id', id)
		.order('position', { ascending: true });
	if (error) {
		throw new Error(`Error fetching IPCR functions: ${error.message}`);
	}
	return { ipcrFunctions: data };
}

async function getFunctionCategoriesByFunctionId(id: string, supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from('ipcr_function_category')
		.select()
		.eq('ipcr_function_id', id);
	if (error) {
		throw new Error(`Error fetching IPCR function categories: ${error.message}`);
	}
	return { functionCategories: data };
}

async function getSubCategoriesByCategoryId(id: string, supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from('ipcr_function_sub_category')
		.select()
		.eq('ipcr_function_category_id', id);
	if (error) {
		throw new Error(`Error fetching IPCR function sub categories: ${error.message}`);
	}
	return { subCategories: data };
}

type ParentType = 'function' | 'category' | 'sub-category';

export async function getIndicatorsByParent(
	parentId: string,
	parentType: ParentType,
	supabase: SupabaseClient<Database>
) {
	// Map parent type to corresponding column name
	let columnMap = {
		function: 'ipcr_function_id',
		category: 'ipcr_function_category_id',
		'sub-category': 'ipcr_function_sub_category_id'
	};

	const columnName = columnMap[parentType];

	if (!columnName) {
		throw new Error(`Invalid parent type: ${parentType}`);
	}

	const { data, error } = await supabase.from('ipcr_indicator').select().eq(columnName, parentId);

	if (error) {
		throw new Error(`Error fetching IPCR indicators: ${error.message}`);
	}

	return { indicators: data };
}

type FlattenedItem = {
	id: string;
	type: 'category' | 'indicator';
	position: number;
	data: Tables<'ipcr_indicator'> | Tables<'ipcr_function_category'>;
};

export async function fetchDataFunction(functionId: string, supabase: SupabaseClient<Database>) {
	try {
		// Fetch both categories and indicators in parallel
		const [categoriesResult, indicatorsResult] = await Promise.all([
			getFunctionCategoriesByFunctionId(functionId, supabase),
			getIndicatorsByParent(functionId, 'function', supabase)
		]);

		// Transform the data into flattened items with type markers
		const categoriesWithType: FlattenedItem[] = categoriesResult.functionCategories.map(
			(category) => ({
				id: category.id,
				type: 'category',
				position: category.position,
				data: category
			})
		);

		const indicatorsWithType: FlattenedItem[] = indicatorsResult.indicators.map((indicator) => ({
			id: indicator.id,
			type: 'indicator',
			position: indicator.position,
			data: indicator
		}));

		// Combine and sort the items
		const combinedItems = [...categoriesWithType, ...indicatorsWithType].sort((a, b) => {
			if (a.position !== b.position) {
				return a.position - b.position;
			}
			if (a.type !== b.type) {
				return a.type === 'category' ? -1 : 1;
			}
			return a.id.localeCompare(b.id);
		});

		return {
			success: true as const,
			data: combinedItems
		};
	} catch (error) {
		console.error('Error in fetchDataFunction:', error);
		return {
			success: false as const,
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

type FlattenedItemCategoryData = {
	id: string;
	position: number;
} & (
	| {
			type: 'sub-category';
			data: Tables<'ipcr_function_sub_category'>;
	  }
	| {
			type: 'indicator';
			data: Tables<'ipcr_indicator'>;
	  }
);

export async function fetchDataCategory(categoryId: string, supabase: SupabaseClient<Database>) {
	try {
		const [subCategoriesResult, indicatorsResult] = await Promise.all([
			supabase
				.from('ipcr_function_sub_category')
				.select()
				.eq('ipcr_function_category_id', categoryId),
			getIndicatorsByParent(categoryId, 'category', supabase)
		]);

		if (subCategoriesResult.error) {
			throw new Error(`Error fetching sub-categories: ${subCategoriesResult.error.message}`);
		}

		const subCategoriesWithType: FlattenedItemCategoryData[] = subCategoriesResult.data.map(
			(subCategory) => ({
				id: subCategory.id,
				type: 'sub-category',
				position: subCategory.position,
				data: subCategory
			})
		);

		const indicatorsWithType: FlattenedItemCategoryData[] = indicatorsResult.indicators.map(
			(indicator) => ({
				id: indicator.id,
				type: 'indicator',
				position: indicator.position,
				data: indicator
			})
		);

		const combinedItems = [...subCategoriesWithType, ...indicatorsWithType].sort((a, b) => {
			if (a.position !== b.position) {
				return a.position - b.position;
			}
			if (a.type !== b.type) {
				return a.type === 'sub-category' ? -1 : 1;
			}
			return a.id.localeCompare(b.id);
		});

		return {
			success: true as const,
			data: combinedItems
		};
	} catch (error) {
		console.error('Error in fetchDataCategory:', error);
		return {
			success: false as const,
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
