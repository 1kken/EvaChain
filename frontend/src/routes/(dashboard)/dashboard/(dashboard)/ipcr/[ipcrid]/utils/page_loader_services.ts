import type { Tables } from '$lib/types/database.types';

//position update
//category
export async function updateCategoryPosition(ipcrCategories: Tables<'ipcr_function_category'>[]) {
	try {
		const response = await fetch(`/api/ipcr_function_category`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ipcrCategories)
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to update position');
		}

		return result;
	} catch (error) {
		console.error('Error updating position:', error);
		return {
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//sub category
export async function updateSubCategoryPosition(
	ipcrSubCategory: Tables<'ipcr_function_sub_category'>[]
) {
	try {
		const response = await fetch(`/api/ipcr/sub_category`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ipcrSubCategory)
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to update position');
		}

		return result;
	} catch (error) {
		console.error('Error updating position:', error);
		return {
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//indicator!!!
export async function updateIndicatorPosition(ipcrIndicators: Tables<'ipcr_indicator'>[]) {
	try {
		const response = await fetch(`/api/ipcr_function_indicator`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ipcrIndicators)
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to update position');
		}

		return result;
	} catch (error) {
		console.error('Error updating position:', error);
		return {
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//*****************FETCHING ****************************/

//PROFILES!!!!!!!!!!!!!!!!!
export async function fetchProfileByname(name: string) {
	try {
		const response = await fetch(`/api/profiles/fetch_by_name?name=${name}`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch profile');
		}

		return result.results;
	} catch (error) {
		console.error('Error fetching profile:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

export async function fetchProfileById(id: string) {
	try {
		const response = await fetch(`/api/profiles/fetch_by_id?id=${id}`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch profile');
		}

		return result.data;
	} catch (error) {
		console.error('Error fetching profile:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//CATEGORY!!!!
interface IpcrFunctionCategoryResponse {
	data: Tables<'ipcr_function_category'>[];
	error?: string;
}

export async function fetchIpcrFunctionCategories(
	id: string
): Promise<IpcrFunctionCategoryResponse> {
	try {
		const response = await fetch(`/api/ipcr_function_category?ipcr_function_id=${id}`);
		const result: IpcrFunctionCategoryResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch ipcr categories');
		}

		return result;
	} catch (error) {
		console.error('Error fetching ipcr categories:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//SUB-CATEGORY!!!!
interface IpcrFunctionSubCategoryResponse {
	data: Tables<'ipcr_function_sub_category'>[];
	error?: string;
}

export async function fetchIpcrFunctionSubCategories(
	id: string
): Promise<IpcrFunctionSubCategoryResponse> {
	try {
		const response = await fetch(`/api/ipcr/sub_category?ipcr_category_id=${id}`);
		const result: IpcrFunctionSubCategoryResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch ipcr categories');
		}

		return result;
	} catch (error) {
		console.error('Error fetching ipcr categories:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//INDICATOR!!!!
interface IpcrIndicatorResponse {
	data: Tables<'ipcr_indicator'>[];
	error?: string;
}

export async function fetchIpcrFunctionIndicators(
	parent: string,
	id: string
): Promise<IpcrIndicatorResponse> {
	try {
		const response = await fetch(`/api/ipcr_function_indicator?${parent}=${id}`);
		const result: IpcrIndicatorResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch ipcr indicators');
		}
		return result;
	} catch (error) {
		console.error('Error fetching ipcr indicators:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//for the op headers================================================
// Type for the error response
interface ErrorResponse {
	data: [];
	error: string;
}
export async function fetchOpHeaders(): Promise<Tables<'op_header'>[] | ErrorResponse> {
	try {
		const response = await fetch(`/api/operational_plan/ipcr_function_header`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch op headers');
		}

		return result.data;
	} catch (error) {
		console.error('Error fetching op headers:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

// Type for the success response
interface SuccessResponse {
	data: Tables<'op_header_indicators'>[];
}

// Type for the error response
interface ErrorResponse {
	data: [];
	error: string;
}

// Combined response type
type FetchHeaderIndicatorsResponse = SuccessResponse | ErrorResponse;

export async function fetchHeaderIndicators(
	headerId: string
): Promise<FetchHeaderIndicatorsResponse> {
	try {
		const response = await fetch(`/api/operational_plan/ipcr_indicator?headerId=${headerId}`);
		const result = await response.json();
		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch indicators');
		}
		return { data: result.data };
	} catch (error) {
		console.error('Error fetching indicators:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//reverse
// Type for the success response
interface SuccessResponse {
	data: Tables<'op_header_indicators'>[];
}

// Type for the error response
interface ErrorResponse {
	data: [];
	error: string;
}

// Combined response type
type FetchIndicatorsByIpcrActivityResponse = SuccessResponse | ErrorResponse;

export async function fetchIndicatorsByIpcrActivityIndicator(
	indicatorId: string
): Promise<FetchIndicatorsByIpcrActivityResponse> {
	try {
		const response = await fetch(
			`/api/operational_plan/ipcr_indicator_search_by_ipcr_activity_indicator_id?indicatorId=${indicatorId}`
		);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch indicators');
		}

		return { data: result.data };
	} catch (error) {
		console.error('Error fetching indicators:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//fetch the acciomplishments
interface ErrorResponse {
	data: [];
	error: string;
}

export async function fetchAccomplishments(
	indicatorId: string
): Promise<Tables<'ipcr_indicator_accomplishment'>[] | ErrorResponse> {
	try {
		const response = await fetch(`/api/ipcr/accomplishments?indicator_id=${indicatorId}`);
		const result = await response.json();
		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch accomplishments');
		}

		return result;
	} catch (error) {
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//fetch the evidence
export type SignedUrlResponse = {
	signedUrl: string;
};

export async function getIpcrIndicatorEvidence(
	ipcrIndicatorId: string
): Promise<SignedUrlResponse> {
	try {
		const response = await fetch(`/api/ipcr/evidence?ipcr_indicator_id=${ipcrIndicatorId}`);

		if (!response.ok) {
			if (response.status === 404) {
				return { signedUrl: '' };
			}
			const error = await response.json();
			throw new Error(error.error || 'Failed to fetch evidence records');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching IPCR indicator evidence:', error);
		return { signedUrl: '' }; // Return empty string URL on any error
	}
}
