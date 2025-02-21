import type { SupabaseClient } from '@supabase/supabase-js';
import { calculateAccomplishmentValue, getCurrentQuarter, type QuarterFieldName } from './helper';
import type { Database } from '$lib/types/database.types';

export const createAccomplishmentWithHistory = async (
	supabase: SupabaseClient<Database>,
	ipcrAccomplishmentId: string,
	quantity: string,
	ipcrIndicatorId: string
): Promise<void> => {
	try {
		const { quarter } = getCurrentQuarter();

		// Get the IPCR indicator details
		const { data: indicator, error: indicatorError } = await supabase
			.from('ipcr_indicator')
			.select('op_activity_indicator_id')
			.eq('id', ipcrIndicatorId)
			.single();

		if (indicatorError || !indicator) {
			throw new Error('Failed to fetch ipcr indicator');
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

		// Create history record
		const { error: historyError } = await supabase.from('accomplishment_history').insert({
			ipcr_indicator_accomplishment_id: ipcrAccomplishmentId,
			input_value: quantity,
			quarter
		});

		if (historyError) {
			throw new Error(`Failed to create history: ${historyError.message}`);
		}

		// Calculate new value
		const newValue = calculateAccomplishmentValue(accIndicator.input_type, currentValue, quantity);

		// Update indicator
		const { error: updateError } = await supabase
			.from('accomplishment_activity_indicator')
			.update({ [quarterField]: newValue })
			.eq('id', matchingIndicator.accomplishment_activity_indicator_id!);

		if (updateError) {
			throw new Error(`Failed to update indicator: ${updateError.message}`);
		}
	} catch (error) {
		console.error('Error in createAccomplishmentWithHistory:', error);
		throw error;
	}
};
