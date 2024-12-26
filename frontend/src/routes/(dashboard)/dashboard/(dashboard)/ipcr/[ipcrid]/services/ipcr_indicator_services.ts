import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, withFiles, type Infer } from 'sveltekit-superforms';
import {
	createIpcrIndicatorSchema,
	markIndicatorDoneSchema,
	updateIpcrIndicatorSchema,
	type CreateIpcrIndicatorSchema,
	type MarkIndicatorDoneSchema,
	type UpdateIpcrIndicatorSchema
} from '../schema/ipcr_indicator_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import { error } from '@sveltejs/kit';

export async function createIpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateIpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(createIpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: ipcrFunctionIndicator, error: ipcrError } = await supabase
		.from('ipcr_indicator')
		.insert({ ...form.data })
		.select()
		.single();

	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `Error saving indicator: ${ipcrError.message}`
		});
	}

	return { form, ipcrFunctionIndicator };
}

export async function updateIpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateIpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(updateIpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, ...updateData } = form.data;

	const { data: ipcrFunctionIndicator, error: ipcrError } = await supabase
		.from('ipcr_indicator')
		.update({ ...updateData })
		.eq('id', id)
		.select()
		.single();

	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `Error updating indicator: ${ipcrError.message}`
		});
	}

	return { form, ipcrFunctionIndicator };
}

export async function deleteIpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: ipcrFunctionIndicator, error: ipcrError } = await supabase
		.from('ipcr_indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (ipcrError) {
		console.log('here');
		return message(form, {
			status: 'error',
			text: `Error deleting indicator: ${ipcrError.message}`
		});
	}

	return { form, ipcrFunctionIndicator };
}

export async function markIpcrIndicatorDone(request: Request, supabase: SupabaseClient) {
	console.log('markIpcrIndicatorDone');
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

	const { id, actual_accomplishments, accomplishment_date, pdf_evidence } = form.data;

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
			text: `Error saving IPCR: ${uploadEvidenceError.message}`
		});
	}

	if (!uploadEvidenceData) {
		return message(form, {
			status: 'error',
			text: 'Error saving IPCR: No upload data received'
		});
	}

	// save to ipcr_indicator_evidence
	const { error: saveIndicatorEvidenceError, data: saveIndicatorEvidenceData } = await supabase
		.from('ipcr_indicator_evidence')
		.insert({
			ipcr_indicator_id: id,
			file_path: uploadEvidenceData.fullPath
		})
		.select()
		.single();

	if (saveIndicatorEvidenceError) {
		return message(form, {
			status: 'error',
			text: `Error saving evidence: ${saveIndicatorEvidenceError.message}`
		});
	}

	// Update the indicator status and accomplishments
	const { error: updateError, data: ipcrFunctionIndicator } = await supabase
		.from('ipcr_indicator')
		.update({
			actual_accomplishments,
			accomplishment_date,
			status: 'submitted'
		})
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		return message(form, {
			status: 'error',
			text: `Error updating indicator: ${updateError.message}`
		});
	}

	return withFiles({ form, ipcrFunctionIndicator });
}

// Helper function to upload evidence
async function uploadEvidence(
	indicatorId: string,
	userId: string,
	file: File,
	supabase: SupabaseClient
) {
	const fileExt = file.name.split('.').pop();
	const filePath = `${userId}/${indicatorId}/${Date.now()}.${fileExt}`;

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
