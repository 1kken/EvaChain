import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function uploadEvidence(
	ipcrAccomplishmentId: string,
	indicatorId: string,
	ipcrId: string,
	userId: string,
	file: File,
	supabase: SupabaseClient
) {
	const fileExt = file.name.split('.').pop();
	//userId/ipcrID/indicator.fileExt
	const filePath = `${userId}/${ipcrId}/${indicatorId}/${ipcrAccomplishmentId}.${fileExt}`;

	const { data, error } = await supabase.storage.from('indicator_evidence').upload(filePath, file);

	if (error) {
		return { error };
	}

	return {
		data: {
			fullPath: filePath
		}
	};
}

//* FOR ACCOMPLISHMENT RELATED FUNCTIONS and types
// Helper function to calculate values based on type
export const calculateAccomplishmentValue = (
	inputType: 'percentage' | 'number' | 'ratio' | 'text',
	currentValue: string | null,
	newValue: string,
	valueToSubtract?: string
): string => {
	switch (inputType) {
		case 'percentage':
			return handlePercentageType(currentValue, newValue, valueToSubtract);
		case 'number':
			return handleNumberType(currentValue, newValue, valueToSubtract);
		case 'ratio':
			return handleRatioType(currentValue, newValue, valueToSubtract);
		case 'text':
			return handleTextType(currentValue, newValue, valueToSubtract);
		default:
			throw new Error(`Unsupported input type: ${inputType}`);
	}
};

export interface Quarter {
	startDate: Date;
	endDate: Date;
	quarter: 1 | 2 | 3 | 4;
}

export type QuarterFieldName =
	| 'q1_accomplishment'
	| 'q2_accomplishment'
	| 'q3_accomplishment'
	| 'q4_accomplishment';
// Get current quarter
export const getCurrentQuarter = (): Quarter => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentQuarter = (Math.floor(now.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
	const startDate = new Date(currentYear, (currentQuarter - 1) * 3, 1);
	const endDate = new Date(currentYear, currentQuarter * 3, 0);

	return { startDate, endDate, quarter: currentQuarter };
};

// Handle different types of values
export const handlePercentageType = (
	currentValue: string | null,
	newValue: string,
	valueToSubtract?: string
): string => {
	const newPercentage = parseFloat(newValue.replace('%', ''));

	if (!currentValue) return `${newPercentage.toFixed(2)}%`;

	let baseValue = parseFloat(currentValue.replace('%', ''));

	// If we're subtracting a value
	if (valueToSubtract) {
		const subtractPercentage = parseFloat(valueToSubtract.replace('%', ''));
		baseValue -= subtractPercentage;
	} else {
		baseValue += newPercentage;
	}

	return `${baseValue.toFixed(2)}%`;
};

export const handleNumberType = (
	currentValue: string | null,
	newValue: string,
	valueToSubtract?: string
): string => {
	const newNumber = parseInt(newValue, 10);

	if (!currentValue) return newNumber.toString();

	let baseValue = parseInt(currentValue, 10);

	if (valueToSubtract) {
		baseValue -= parseInt(valueToSubtract, 10);
	} else {
		baseValue += newNumber;
	}

	return baseValue.toString();
};

export const handleRatioType = (
	currentValue: string | null,
	newValue: string,
	valueToSubtract?: string
): string => {
	// Handle the case where we're deleting the last value
	if (valueToSubtract && (!currentValue || currentValue === valueToSubtract)) {
		return '0:0';
	}

	// Parse new value
	const [newNumerator, newDenominator] = newValue.split(':').map(Number);

	// If no current value, return the new value
	if (!currentValue) {
		return `${newNumerator}:${newDenominator}`;
	}

	// Parse current value
	const [currentNumerator, currentDenominator] = currentValue.split(':').map(Number);

	if (valueToSubtract) {
		// Subtracting a value (deletion)
		const [subtractNumerator] = valueToSubtract.split(':').map(Number);
		const resultNumerator = currentNumerator - subtractNumerator;

		// Ensure we don't go below 0:0
		if (resultNumerator <= 0) {
			return '0:0';
		}

		return `${resultNumerator}:${currentDenominator}`;
	} else {
		// Adding a value
		return `${currentNumerator + newNumerator}:${currentDenominator || newDenominator}`;
	}
};

export const handleTextType = (
	currentValue: string | null,
	newValue: string,
	valueToSubtract?: string
): string => {
	// Clean input values by removing extra spaces and commas
	const cleanText = (text: string): string => {
		return text.trim().replace(/,\s*$/, '').replace(/^\s*,/, '');
	};

	// If no current value, return cleaned new value
	if (!currentValue) {
		return cleanText(newValue);
	}

	// Clean the current value
	const cleanedCurrent = cleanText(currentValue);

	if (valueToSubtract) {
		// Handle deletion
		const valuesToKeep = cleanedCurrent
			.split(',')
			.map((v) => v.trim())
			.filter((v) => v !== cleanText(valueToSubtract))
			.filter((v) => v !== ''); // Remove empty entries

		// If no values left after deletion
		if (valuesToKeep.length === 0) {
			return '';
		}

		return valuesToKeep.join(', ');
	} else {
		// Handle update/addition
		const values = cleanedCurrent.split(',').map((v) => v.trim());

		// Find if we're updating an existing value
		const updateIndex = values.findIndex((v) => v === cleanText(newValue));

		if (updateIndex >= 0) {
			// Replace existing value
			values[updateIndex] = cleanText(newValue);
		} else {
			// Add new value
			values.push(cleanText(newValue));
		}

		return values
			.filter((v) => v !== '') // Remove empty entries
			.join(', ');
	}
};
