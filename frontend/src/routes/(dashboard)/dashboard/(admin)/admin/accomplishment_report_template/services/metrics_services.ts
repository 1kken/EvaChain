import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createAccomplishmentMetricSchemaTemplate,
	updateAccomplishmentMetricSchemaTemplate,
	type CreateAccomplishmentMetricSchemaTemplate,
	type UpdateAccomplishmentMetricSchemaTemplate
} from '../schema/metrics_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createAccomplishmentMetricTemplate(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<CreateAccomplishmentMetricSchemaTemplate>,
		App.Superforms.Message
	>(request, zod(createAccomplishmentMetricSchemaTemplate));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: metrics, error: metricsError } = await supabase
		.from('accomplishment_template_metrics')
		.insert(form.data)
		.select()
		.single();

	if (metricsError) {
		return message(form, {
			status: 'error',
			text: `Error saving template metrics, ${metricsError.message}`
		});
	}

	return { form, metrics };
}

export async function updateAccomplishmentMetricTemplate(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<UpdateAccomplishmentMetricSchemaTemplate>,
		App.Superforms.Message
	>(request, zod(updateAccomplishmentMetricSchemaTemplate));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, ...updateData } = form.data;

	const { data: metrics, error: metricsError } = await supabase
		.from('accomplishment_template_metrics')
		.update(updateData)
		.eq('id', id)
		.select()
		.single();

	if (metricsError) {
		return message(form, {
			status: 'error',
			text: `Error updating template metrics, ${metricsError.message}`
		});
	}

	return { form, metrics };
}

export async function deleteAccomplishmentMetricTemplate(
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
		.from('accomplishment_template_metrics')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (metricsError) {
		return message(form, {
			status: 'error',
			text: `Error deleting template metrics, ${metricsError.message}`
		});
	}

	return { form, metrics };
}
