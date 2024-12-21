import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpActivitySchema,
	updateOpActivitySchema,
	type CreateOpActivitySchema,
	type UpdateOpActivitySchema
} from '../schema/op_activity_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpActivity(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpActivitySchema>, App.Superforms.Message>(
		request,
		zod(createOpActivitySchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opActivity, error: opActivityError } = await supabase
		.from('op_activity')
		.insert({ ...form.data })
		.select()
		.single();
	if (opActivityError) {
		return message(form, {
			status: 'error',
			text: `Error saving objective activity, ${opActivityError.message}`
		});
	}

	return { form, opActivity };
}

//update
export async function updateOpActivity(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpActivitySchema>, App.Superforms.Message>(
		request,
		zod(updateOpActivitySchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opActivity, error: opActivityError } = await supabase
		.from('op_activity')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();

	if (opActivityError) {
		return message(form, {
			status: 'error',
			text: `Error updating Objective Activity, ${opActivityError.message}`
		});
	}

	return { form, opActivity };
}

//delete

export async function deleteOpActivity(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opActivity, error: opActivityError } = await supabase
		.from('op_activity')
		.delete()
		.eq('id', form.data.id)
		.select()
		.single();

	if (opActivityError) {
		return message(form, {
			status: 'error',
			text: `Error deleting Objective Activity, ${opActivityError.message}`
		});
	}

	return { form, opActivity };
}
