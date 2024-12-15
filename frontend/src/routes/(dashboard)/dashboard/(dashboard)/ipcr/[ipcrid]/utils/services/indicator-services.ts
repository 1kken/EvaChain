import {
	createIndicatorSchema,
	markIndicatorDoneSchema,
	updateIndicatorSchema,
	type CreateIndicatorSchema,
	type MarkIndicatorDoneSchema,
	type UpdateIndicatorSchema
} from '../schemas/indicator_schema';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '../schemas/universal_delete_schema';

import { message, superValidate, withFiles, type Infer } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import { zod } from 'sveltekit-superforms/adapters';
import { saveIndicatorEvidence, uploadEvidence } from './indicator_evidence_services';
import { error } from '@sveltejs/kit';
export async function createIndicator(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<CreateIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(createIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let {
		indicator,
		core_function_id,
		sub_core_function_id,
		support_function_id,
		sub_support_function_id,
		position
	} = form.data;
	const { data: indicatorData, error: indicatorError } = await supabase
		.from('indicator')
		.insert({
			indicator,
			core_function_id,
			sub_core_function_id,
			support_function_id,
			sub_support_function_id,
			position
		})
		.select()
		.single();

	if (indicatorError) {
		return message(form, {
			status: 'error',
			text: `Error saving core function, ${indicatorError.message}`
		});
	}

	return { form, indicatorData };
}

export async function deleteIndicator(request: Request, supabase: SupabaseClient) {
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

	const { error: deleteError, data: indicatorData } = await supabase
		.from('indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (deleteError) {
		console.log(deleteError.message);
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${deleteError.message}`
		});
	}

	return { form, indicatorData };
}

export async function updateIndicator(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<UpdateIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(updateIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, indicator } = form.data;

	const { error: updateError, data: indicatorData } = await supabase
		.from('indicator')
		.update({ indicator })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		console.log(updateError.message);
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, indicatorData };
}
export async function markIndicatorDone(request: Request, supabase: SupabaseClient) {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) {
		return error(401, 'Unauthorized');
	}
	const user_id = user.id;
	let form = await superValidate<Infer<MarkIndicatorDoneSchema>, App.Superforms.Message>(
		request,
		zod(markIndicatorDoneSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, accomplishment, accomplishment_date, pdf_evidence } = form.data;

	if (!pdf_evidence) {
		return message(form, {
			status: 'error',
			text: 'Please upload a file'
		});
	}

	// upload evidence
	const { data: uploadEvidenceData, error: uploadEvidenceError } = await uploadEvidence(
		id,
		user_id,
		pdf_evidence,
		supabase
	);

	if (uploadEvidenceError) {
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${uploadEvidenceError.message}`
		});
	}
	if (!uploadEvidenceData) {
		return message(form, {
			status: 'error',
			text: `Error saving IPCR`
		});
	}
	// save to evidence indicator evidence
	const { error: saveIndicatorEvidenceError, data: saveIndicatorEvidenceData } =
		await saveIndicatorEvidence(id, uploadEvidenceData?.fullPath, supabase);
	if (saveIndicatorEvidenceError) {
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${saveIndicatorEvidenceError.message}`
		});
	}
	const { error: updateError, data: indicatorData } = await supabase
		.from('indicator')
		.update({ accomplishment, accomplishment_date, status: 'submitted' })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		console.log('error here');
		console.log(updateError.message);
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return withFiles({ form, indicatorData });
}
