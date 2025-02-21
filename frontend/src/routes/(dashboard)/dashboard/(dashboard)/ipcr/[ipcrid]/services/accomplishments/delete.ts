import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { calculateAccomplishmentValue, type QuarterFieldName } from './helper';

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
