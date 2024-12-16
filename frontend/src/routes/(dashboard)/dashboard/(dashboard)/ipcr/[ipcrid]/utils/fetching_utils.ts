import type { Tables } from '$lib/types/database.types';
import type OtherFunction from '../(components)/(body)/(other_function)/OtherFunction.svelte';

interface IndicatorResponse {
	data: Tables<'indicator'>[];
	error?: string;
}

interface ParameterType {
	url_params:
		| 'core_function_id'
		| 'sub_core_function_id'
		| 'support_function_id'
		| 'sub_support_function_id'
		| 'other_function_id'
		| 'sub_other_function_id';
	id: string;
}

export async function fetchIndicatorsByParam(params: ParameterType): Promise<IndicatorResponse> {
	try {
		const response = await fetch(`/api/indicator?${params.url_params}=${params.id}`);

		if (!response.ok) {
			const result: IndicatorResponse = await response.json();
			throw new Error(result.error || 'Failed to fetch indicators');
		}
		const result: IndicatorResponse = await response.json();
		return result;
	} catch (error) {
		console.error('Error fetching indicators:', error);
		// Return a proper error response
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

interface SubCoreFunctionResponse {
	data: Tables<'sub_core_function'>[];
	error?: string;
}

export async function fetchSubCoreFunctions(id: string): Promise<SubCoreFunctionResponse> {
	try {
		const response = await fetch(`/api/sub_core_function?core_function_id=${id}`);
		const result: SubCoreFunctionResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch sub core functions');
		}

		return result;
	} catch (error) {
		console.error('Error fetching sub core functions:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//Sub support
interface SubSupportFunctionResponse {
	data: Tables<'sub_support_function'>[];
	error?: string;
}

export async function fetchSubSupportFunctions(id: string): Promise<SubSupportFunctionResponse> {
	try {
		const response = await fetch(`/api/sub_support_function?support_function_id=${id}`);
		const result: SubSupportFunctionResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch sub support functions');
		}

		return result;
	} catch (error) {
		console.error('Error fetching sub support functions:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//Other function
interface SubOtherFunctionResponse {
	data: Tables<'sub_other_function'>[];
	error?: string;
}

export async function fetchSubOtherFunctions(id: string): Promise<SubOtherFunctionResponse> {
	try {
		const response = await fetch(`/api/sub_other_function?other_function_id=${id}`);
		const result: SubOtherFunctionResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch sub support functions');
		}

		return result;
	} catch (error) {
		console.error('Error fetching sub support functions:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
