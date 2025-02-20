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
import {
	deleteAccomplishmentWithHistory,
	updateAccomplishmentWithHistory
} from './accomplishment_helper';

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

//===== CREATE ACCOMPLISHMENT =====/
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

	// Create the accomplishment first
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

	// Now update the history with the newly created accomplishment ID
	try {
		await updateAccomplishmentWithHistory(
			supabase,
			ipcrAccomplishment.id, // Use the new accomplishment's ID
			quantity,
			ipcr_indicator_id
		);
	} catch (error) {
		// If history update fails, clean up the created accomplishment
		await supabase.from('ipcr_indicator_accomplishment').delete().eq('id', ipcrAccomplishment.id);

		return message(form, {
			status: 'error',
			text: `Error updating IPCR: ${error}`
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

	// Upload evidence
	const { data: uploadEvidenceData, error: uploadEvidenceError } = await uploadEvidence(
		ipcrAccomplishment.id,
		ipcr_indicator_id,
		data,
		user_id,
		pdf_evidence,
		supabase
	);

	if (uploadEvidenceError || !uploadEvidenceData) {
		// Clean up if evidence upload fails
		await supabase.from('ipcr_indicator_accomplishment').delete().eq('id', ipcrAccomplishment.id);

		return message(form, {
			status: 'error',
			text: uploadEvidenceError
				? `Error saving IPCR: ${uploadEvidenceError.message}`
				: 'Error saving IPCR: No upload data received'
		});
	}

	// Save to ipcr_indicator_evidence
	const { error: saveIndicatorEvidenceError } = await supabase
		.from('ipcr_indicator_evidence')
		.insert({
			ipcr_indicator_accomplishment_id: ipcrAccomplishment.id,
			file_path: uploadEvidenceData.fullPath
		})
		.select()
		.single();

	if (saveIndicatorEvidenceError) {
		// Clean up if evidence save fails
		await supabase.storage.from('indicator_evidence').remove([uploadEvidenceData.fullPath]);

		await supabase.from('ipcr_indicator_accomplishment').delete().eq('id', ipcrAccomplishment.id);

		return message(form, {
			status: 'error',
			text: `Error saving evidence: ${saveIndicatorEvidenceError.message}`
		});
	}

	// Process blockchain
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

	// First update the accomplishment
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

	// Update history and totals
	try {
		await updateAccomplishmentWithHistory(
			supabase,
			id, // accomplishment id
			quantity,
			ipcrAccomplishment.ipcr_indicator_id
		);
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Error updating IPCR: ${error}`
		});
	}

	// Handle file update
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
			text: 'No indicator evidence found Which is unexpected behavior please contact developer'
		});
	}

	// Update storage
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

	// Update blockchain
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

//DELETE ACCOMPLISHMENT==============--
export async function deleteAccomplishment(request: Request, supabase: SupabaseClient<Database>) {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return error(401, 'Unauthorized');

	const form = await superValidate<Infer<UniversalDeleteSchema>>(
		request,
		zod(universalDeleteSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Invalid input'
		});
	}

	const { id } = form.data;

	// Get accomplishment and evidence data before deletion
	const { data: ipcrAccomplishment, error: accomplishmentError } = await supabase
		.from('ipcr_indicator_accomplishment')
		.select(
			`
      id,
      ipcr_indicator_id,
      actual_accomplishments,
      accomplishment_date,
      quantity,
      ipcr_indicator_evidence (
        file_path
      )
    `
		)
		.eq('id', id)
		.single();

	if (accomplishmentError || ipcrAccomplishment === null) {
		return message(form, {
			status: 'error',
			text: `Error fetching accomplishment: ${accomplishmentError.message}`
		});
	}

	// Update quarterly totals before deletion
	try {
		await deleteAccomplishmentWithHistory(supabase, id, ipcrAccomplishment.ipcr_indicator_id);
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Error updating accomplishment totals: ${error}`
		});
	}

	// Upload to blockchain before deletion
	try {
		await processIpcrEvidence(supabase, id, 2);
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Error processing evidence: ${error}`
		});
	}

	// Delete file from storage bucket
	const { error: storageError } = await supabase.storage
		.from('indicator_evidence')
		.remove([ipcrAccomplishment.ipcr_indicator_evidence[0].file_path]);

	if (storageError) {
		return message(form, {
			status: 'error',
			text: `Error deleting file: ${storageError.message}`
		});
	}

	// Delete accomplishment (this will cascade delete the history records)
	const { error: deleteError } = await supabase
		.from('ipcr_indicator_accomplishment')
		.delete()
		.eq('id', id);

	if (deleteError) {
		return message(form, {
			status: 'error',
			text: `Error deleting accomplishment: ${deleteError.message}`
		});
	}

	return { form, ipcrAccomplishment };
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
