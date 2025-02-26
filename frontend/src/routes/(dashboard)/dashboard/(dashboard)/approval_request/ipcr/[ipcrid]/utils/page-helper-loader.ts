import type { Tables } from '$lib/types/database.types';

export const fetchDirectIndicatorsBySupervisor = async (
	functionId: string,
	supervisorId: string
): Promise<Tables<'ipcr_indicator'>[]> => {
	try {
		const response = await fetch(
			`/api/approval/indicator?ipcr_function_id=${functionId}&supervisor_id=${supervisorId}`
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to fetch indicators');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching indicators:', error);
		return [];
	}
};

export const fetchCategoriesBySupervisor = async (
	functionId: string,
	supervisorId: string
): Promise<Tables<'ipcr_function_category'>[]> => {
	try {
		const response = await fetch(
			`/api/approval/category?ipcr_function_id=${functionId}&supervisor_id=${supervisorId}`
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to fetch categories');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching categories:', error);
		return [];
	}
};

export const fetchIpcrFunctionSubCategories = async (
	ipcrCategoryId: string
): Promise<Tables<'ipcr_function_sub_category'>[]> => {
	try {
		const response = await fetch(`/api/ipcr/sub_category?ipcr_category_id=${ipcrCategoryId}`);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to fetch sub-categories');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching sub-categories:', error);
		return [];
	}
};

export const fetchIpcrFunctionIndicators = async (
	parent: string,
	id: string
): Promise<Tables<'ipcr_indicator'>[]> => {
	try {
		const response = await fetch(`/api/ipcr_function_indicator?${parent}=${id}`);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to fetch indicators');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching indicators:', error);
		return [];
	}
};

export const fetchAccomplishments = async (
	indicatorId: string
): Promise<Tables<'ipcr_indicator_accomplishment'>[]> => {
	try {
		const response = await fetch(`/api/ipcr/accomplishments?indicator_id=${indicatorId}`);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to fetch accomplishments');
		}

		const result = await response.json();
		// Check if data exists in the response, otherwise return the result directly
		return result.data || result || [];
	} catch (error) {
		console.error('Error fetching accomplishments:', error);
		return [];
	}
};

export const fetchIndicatorsByIpcrActivityIndicator = async (
	indicatorId: string
): Promise<Tables<'op_header_indicators'>[]> => {
	try {
		const response = await fetch(
			`/api/operational_plan/ipcr_indicator_search_by_ipcr_activity_indicator_id?indicatorId=${indicatorId}`
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to fetch indicators');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching indicators:', error);
		return [];
	}
};
