import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Quarter {
	startDate: Date;
	endDate: Date;
	quarter: 1 | 2 | 3 | 4;
}

type QuarterFieldName =
	| 'q1_accomplishment'
	| 'q2_accomplishment'
	| 'q3_accomplishment'
	| 'q4_accomplishment';

// Get current quarter
const getCurrentQuarter = (): Quarter => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentQuarter = (Math.floor(now.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
	const startDate = new Date(currentYear, (currentQuarter - 1) * 3, 1);
	const endDate = new Date(currentYear, currentQuarter * 3, 0);

	return { startDate, endDate, quarter: currentQuarter };
};

// Get history for an accomplishment
export const getAccomplishmentHistory = async (
	supabase: SupabaseClient<Database>,
	accomplishmentId: string
) => {
	const { data, error } = await supabase
		.from('accomplishment_history')
		.select('*')
		.eq('ipcr_indicator_accomplishment_id', accomplishmentId)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
};

// Update accomplishment with history tracking
export const updateAccomplishmentWithHistory = async (
	supabase: SupabaseClient<Database>,
	accomplishmentId: string,
	newQuantity: string,
	indicatorId: string
) => {
	try {
		// Get current quarter
		const { quarter } = getCurrentQuarter();

		// First check if there's an existing history record for this accomplishment in this quarter
		const { data: existingHistory, error: historyCheckError } = await supabase
			.from('accomplishment_history')
			.select('*')
			.eq('ipcr_indicator_accomplishment_id', accomplishmentId)
			.eq('quarter', quarter)
			.single();

		// Get the indicator to determine input type
		const { data: indicator, error: indicatorError } = await supabase
			.from('ipcr_indicator')
			.select('op_activity_indicator_id')
			.eq('id', indicatorId)
			.single();

		if (indicatorError || !indicator) {
			throw new Error('Failed to fetch indicator');
		}

		// Get matching accomplishment indicator
		const { data: matchingIndicator, error: matchError } = await supabase
			.from('op_acc_indicators_view')
			.select('accomplishment_activity_indicator_id')
			.eq('op_activity_indicator_id', indicator.op_activity_indicator_id)
			.single();

		if (matchError || !matchingIndicator) {
			throw new Error('Failed to find matching indicator');
		}

		// Get current indicator values
		const { data: accIndicator, error: accError } = await supabase
			.from('accomplishment_activity_indicator')
			.select('*')
			.eq('id', matchingIndicator.accomplishment_activity_indicator_id!)
			.single();

		if (accError || !accIndicator) {
			throw new Error('Failed to fetch accomplishment indicator');
		}

		const quarterField = `q${quarter}_accomplishment` as QuarterFieldName;
		const currentValue = accIndicator[quarterField as keyof typeof accIndicator] as string | null;

		// If updating existing record
		if (existingHistory) {
			// First subtract the old value
			const baseValue = calculateAccomplishmentValue(
				accIndicator.input_type,
				currentValue,
				'0', // Using 0 as new value
				existingHistory.input_value // Value to subtract
			);

			// Then add the new value
			const newValue = calculateAccomplishmentValue(
				accIndicator.input_type,
				baseValue,
				newQuantity
			);

			// Update history record
			const { error: historyUpdateError } = await supabase
				.from('accomplishment_history')
				.update({
					input_value: newQuantity,
					updated_at: new Date().toISOString()
				})
				.eq('id', existingHistory.id);

			if (historyUpdateError) {
				throw new Error(`Failed to update history: ${historyUpdateError.message}`);
			}

			// Update indicator
			const { error: updateError } = await supabase
				.from('accomplishment_activity_indicator')
				.update({ [quarterField]: newValue })
				.eq('id', matchingIndicator.accomplishment_activity_indicator_id!);

			if (updateError) {
				throw new Error(`Failed to update indicator: ${updateError.message}`);
			}
		} else {
			// Create new history record
			const { error: historyError } = await supabase.from('accomplishment_history').insert({
				ipcr_indicator_accomplishment_id: accomplishmentId,
				input_value: newQuantity,
				quarter
			});

			if (historyError) {
				throw new Error(`Failed to create history: ${historyError.message}`);
			}

			// Calculate new value for new record
			const newValue = calculateAccomplishmentValue(
				accIndicator.input_type,
				currentValue,
				newQuantity
			);

			// Update indicator
			const { error: updateError } = await supabase
				.from('accomplishment_activity_indicator')
				.update({ [quarterField]: newValue })
				.eq('id', matchingIndicator.accomplishment_activity_indicator_id!);

			if (updateError) {
				throw new Error(`Failed to update indicator: ${updateError.message}`);
			}
		}
	} catch (error) {
		console.error('Error in updateAccomplishmentWithHistory:', error);
		throw error;
	}
};

// Delete accomplishment and update totals
export const deleteAccomplishmentWithHistory = async (
	supabase: SupabaseClient<Database>,
	accomplishmentId: string,
	indicatorId: string
) => {
	try {
		// Get all history records for this accomplishment
		const { data: historyRecords, error: historyError } = await supabase
			.from('accomplishment_history')
			.select('*')
			.eq('ipcr_indicator_accomplishment_id', accomplishmentId);

		if (historyError) {
			throw new Error(`Failed to fetch history: ${historyError.message}`);
		}

		// Get the indicator info
		const { data: indicator, error: indicatorError } = await supabase
			.from('ipcr_indicator')
			.select('op_activity_indicator_id')
			.eq('id', indicatorId)
			.single();

		if (indicatorError || !indicator) {
			throw new Error('Failed to fetch indicator');
		}

		// Get matching accomplishment indicator
		const { data: matchingIndicator, error: matchError } = await supabase
			.from('op_acc_indicators_view')
			.select('accomplishment_activity_indicator_id')
			.eq('op_activity_indicator_id', indicator.op_activity_indicator_id)
			.single();

		if (matchError || !matchingIndicator) {
			throw new Error('Failed to find matching indicator');
		}

		// Get current indicator values
		const { data: accIndicator, error: accError } = await supabase
			.from('accomplishment_activity_indicator')
			.select('*')
			.eq('id', matchingIndicator.accomplishment_activity_indicator_id!)
			.single();

		if (accError || !accIndicator) {
			throw new Error('Failed to fetch accomplishment indicator');
		}

		// Group history records by quarter
		const recordsByQuarter = historyRecords.reduce(
			(acc, record) => {
				if (!acc[record.quarter]) {
					acc[record.quarter] = [];
				}
				acc[record.quarter].push(record);
				return acc;
			},
			{} as Record<number, typeof historyRecords>
		);

		// Update each quarter's total
		for (const [quarter, records] of Object.entries(recordsByQuarter)) {
			const quarterField = `q${quarter}_accomplishment` as QuarterFieldName;
			const currentValue = accIndicator[quarterField as keyof typeof accIndicator] as string | null;

			// Subtract all values for this quarter
			let newValue = currentValue;
			for (const record of records) {
				newValue = calculateAccomplishmentValue(
					accIndicator.input_type,
					newValue,
					'0',
					record.input_value // This will be subtracted
				);
			}

			// Update the quarter total
			const { error: updateError } = await supabase
				.from('accomplishment_activity_indicator')
				.update({ [quarterField]: newValue })
				.eq('id', matchingIndicator.accomplishment_activity_indicator_id!);

			if (updateError) {
				throw new Error(`Failed to update quarter ${quarter}: ${updateError.message}`);
			}
		}
	} catch (error) {
		console.error('Error in deleteAccomplishmentWithHistory:', error);
		throw error;
	}
};

// Helper function to calculate values based on type
const calculateAccomplishmentValue = (
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

// Handle different types of values
const handlePercentageType = (
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

const handleNumberType = (
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

const handleRatioType = (
	currentValue: string | null,
	newValue: string,
	valueToSubtract?: string
): string => {
	const [newNumerator, denominator] = newValue.split(':').map(Number);

	if (!currentValue) return newValue;

	let [currentNumerator] = currentValue.split(':').map(Number);

	if (valueToSubtract) {
		const [subtractNumerator] = valueToSubtract.split(':').map(Number);
		currentNumerator -= subtractNumerator;
	} else {
		currentNumerator += newNumerator;
	}

	return `${currentNumerator}:${denominator}`;
};

const handleTextType = (
	currentValue: string | null,
	newValue: string,
	valueToSubtract?: string
): string => {
	if (!currentValue) return newValue;

	if (valueToSubtract) {
		return currentValue.replace(`, ${valueToSubtract}`, '');
	}

	return `${currentValue}, ${newValue}`;
};
