import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, withFiles, type Infer } from 'sveltekit-superforms';
import {
	createIpcrIndicatorSchema,
	updateIpcrIndicatorSchema,
	type CreateIpcrIndicatorSchema,
	type UpdateIpcrIndicatorSchema
} from '../schema/ipcr_indicator_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import { error } from '@sveltejs/kit';
import {
	createAccomplishmentSchema,
	updateAccomplishmentSchema,
	type CreateAccomplishmentSchema,
	type UpdateAccomplishmentSchema
} from '../schema/ipcr_indicator_accomplishmet';
import { processIpcrEvidence } from '../utils/blockchain/pinata_helper';

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

//===== ADD ACCOMPLISHMENT =====/
export async function createAccomplishment(request: Request, supabase: SupabaseClient<Database>) {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) {
		return error(401, 'Unauthorized');
	}
	const user_id = user.id;

	let form = await superValidate<Infer<CreateAccomplishmentSchema>, App.Superforms.Message>(
		request,
		zod(createAccomplishmentSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { ipcr_indicator_id, actual_accomplishments, accomplishment_date, pdf_evidence, quantity } =
		form.data;

	if (!pdf_evidence) {
		return message(form, {
			status: 'error',
			text: 'Please upload a file'
		});
	}

	const { data: ipcrAccomplishment, error: ipcrAccomplishmentError } = await supabase
		.from('ipcr_indicator_accomplishment')
		.insert({
			ipcr_indicator_id,
			actual_accomplishments,
			accomplishment_date,
			quantity
		})
		.select()
		.single();

	if (ipcrAccomplishmentError) {
		return message(form, {
			status: 'error',
			text: `Error saving IPCR Accomplishment: ${ipcrAccomplishmentError.message}`
		});
	}

	const { data, error: fetchError } = await supabase.rpc('get_ipcr_id_from_indicator', {
		p_indicator_id: ipcr_indicator_id
	});

	if (fetchError || !data) {
		return message(form, {
			status: 'error',
			text: `Error fetching IPCR ID: ${fetchError?.message ?? 'No data received'}`
		});
	}

	// // upload evidence
	const { data: uploadEvidenceData, error: uploadEvidenceError } = await uploadEvidence(
		ipcrAccomplishment.id,
		ipcr_indicator_id,
		data,
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
			ipcr_indicator_accomplishment_id: ipcrAccomplishment.id,
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

	//lets do the block chain here
	try {
		await processIpcrEvidence(supabase, ipcrAccomplishment.id, 0);
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Error processing evidence: ${error}`
		});
	}
	return withFiles({ form, ipcrAccomplishment });
}

//===== UPDATE ACCOMPLISHMENT =====/
export async function updateAccomplishment(request: Request, supabase: SupabaseClient<Database>) {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) {
		return error(401, 'Unauthorized');
	}
	const user_id = user.id;

	let form = await superValidate<Infer<UpdateAccomplishmentSchema>, App.Superforms.Message>(
		request,
		zod(updateAccomplishmentSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, actual_accomplishments, accomplishment_date, pdf_evidence, quantity } = form.data;

	const { data: ipcrAccomplishment, error: ipcrAccomplishmentError } = await supabase
		.from('ipcr_indicator_accomplishment')
		.update({
			actual_accomplishments,
			accomplishment_date,
			quantity
		})
		.eq('id', id)
		.select()
		.single();

	if (ipcrAccomplishmentError) {
		return message(form, {
			status: 'error',
			text: `Error updating IPCR Accomplishment: ${ipcrAccomplishmentError.message}`
		});
	}

	const { data: indicatorEvidence, error: fetchIndicatorEvidenceError } = await supabase
		.from('ipcr_indicator_evidence')
		.select('file_path')
		.eq('ipcr_indicator_accomplishment_id', id)
		.single();

	if (fetchIndicatorEvidenceError) {
		return message(form, {
			status: 'error',
			text: `Error fetching indicator evidence: ${fetchIndicatorEvidenceError.message}`
		});
	}

	if (!indicatorEvidence.file_path) {
		return message(form, {
			status: 'error',
			text: 'No indicator evidence found Which ios unexpected behavior please contact developer'
		});
	}

	//update storage
	const { data, error: updateStorageError } = await supabase.storage
		.from('indicator_evidence')
		.update(indicatorEvidence.file_path, pdf_evidence, {
			cacheControl: '3600',
			upsert: true
		});

	if (updateStorageError) {
		return message(form, {
			status: 'error',
			text: `Error updating storage: ${updateStorageError.message}`
		});
	}

	//block chain
	try {
		await processIpcrEvidence(supabase, id, 1);
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Error processing evidence: ${error}`
		});
	}

	return withFiles({ form, ipcrAccomplishment });
}

// Helper function to upload evidence
async function uploadEvidence(
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
