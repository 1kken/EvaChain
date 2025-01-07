import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createAccomplishmentMetricSchema,
	toggleIsIncludeMetricsSchema,
	updateAccomplishmentMetricSchema,
	type CreateAccomplishmentMetricSchema,
	type ToggleIsIncludeMetricsSchema,
	type UpdateAccomplishmentMetricSchema
} from '../schema/metrics_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createAccomplishmentMetric(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<CreateAccomplishmentMetricSchema>, App.Superforms.Message>(
		request,
		zod(createAccomplishmentMetricSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: metrics, error: metricsError } = await supabase
		.from('accomplishment_metrics')
		.insert(form.data)
		.select()
		.single();

	if (metricsError) {
		return message(form, {
			status: 'error',
			text: `Error saving metrics, ${metricsError.message}`
		});
	}

	return { form, metrics };
}

export async function updateAccomplishmentMetric(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<UpdateAccomplishmentMetricSchema>, App.Superforms.Message>(
		request,
		zod(updateAccomplishmentMetricSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, ...updateData } = form.data;

	const { data: metrics, error: metricsError } = await supabase
		.from('accomplishment_metrics')
		.update(updateData)
		.eq('id', id)
		.select()
		.single();

	if (metricsError) {
		return message(form, {
			status: 'error',
			text: `Error updating metrics, ${metricsError.message}`
		});
	}

	return { form, metrics };
}

export async function deleteAccomplishmentMetric(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<UniversalDeleteSchema>, App.Superforms.Message>(
		request,
		zod(universalDeleteSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;

	const { data: metrics, error: metricsError } = await supabase
		.from('accomplishment_metrics')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (metricsError) {
		return message(form, {
			status: 'error',
			text: `Error deleting metrics, ${metricsError.message}`
		});
	}

	return { form, metrics };
}

export async function toggleIsIncludeMetrics(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<ToggleIsIncludeMetricsSchema>, App.Superforms.Message>(
		request,
		zod(toggleIsIncludeMetricsSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;

	const { data: metrics, error: toggleError } = await supabase
		.rpc('toggle_metrics_inclusion', { metrics_id: id })
		.single();

	if (toggleError) {
		return message(form, {
			status: 'error',
			text: `Error toggling metrics: ${toggleError.message}`
		});
	}

	return { form, metrics };
}
