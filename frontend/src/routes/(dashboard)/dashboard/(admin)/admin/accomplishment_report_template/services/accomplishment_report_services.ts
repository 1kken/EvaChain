import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	templatePublishSchema,
	type TemplatePublishAction
} from '../schema/accomplishment_template_schema';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function publishAccomplishmentReportTemplate(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<TemplatePublishAction>, App.Superforms.Message>(
		request,
		zod(templatePublishSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { template_id } = form.data;

	// Get the most recent template
	const { data: template, error } = await supabase
		.from('accomplishment_report_template')
		.update({ is_published: true })
		.eq('id', template_id)
		.select()
		.single();

	if (error) {
		return { success: false, error: 'Failed to publish template' };
	}

	return { form, template };
}

export async function unpublishAccomplishmentReportTemplate(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<TemplatePublishAction>, App.Superforms.Message>(
		request,
		zod(templatePublishSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { template_id } = form.data;

	// Get the most recent template
	const { data: template, error } = await supabase
		.from('accomplishment_report_template')
		.update({ is_published: false })
		.eq('id', template_id)
		.select()
		.single();

	if (error) {
		return { success: false, error: 'Failed to publish template' };
	}

	return { form, template };
}
