import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { message, superValidate, withFiles, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createAccomplishmentSchema,
	updateAccomplishmentSchema,
	type CreateAccomplishmentSchema,
	type UpdateAccomplishmentSchema
} from '../schema/ipcr_indicator_accomplishmet';
import { uploadEvidence } from './accomplishments/helper';
import { processIpcrEvidence } from '../utils/blockchain/pinata_helper';
import { deleteAccomplishmentWithHistory } from './accomplishments/delete';
import { createAccomplishmentWithHistory } from './accomplishments/create';
import { updateAccomplishmentWithHistory } from './accomplishments/update';
import type { ProfileWithJoins } from '../../../../../../../app';

//===== CREATE ACCOMPLISHMENT =====/
export async function createAccomplishment(
	request: Request,
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins
) {
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

	// Create the accomplishment first //! NO ERRORS HERE
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
			text: `Error saving IPCR indicator's accomplishment`
		});
	}

	let accomplishmentActivityIndicatorId: string | null = null;
	// Now update the history with the newly created accomplishment ID //! Errors Here
	try {
		accomplishmentActivityIndicatorId = await createAccomplishmentWithHistory(
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
			text: `Error uploading to history and updating Accomplishment Report Totals ${error}`
		});
	}

	//* We need the ipcr Id to upload the evidence
	const { data, error: fetchError } = await supabase.rpc('get_ipcr_id_from_indicator', {
		p_indicator_id: ipcr_indicator_id
	});

	if (fetchError || !data) {
		return message(form, {
			status: 'error',
			text: `Error fetching IPCR ID to upload evidence`
		});
	}

	//* upload evidence
	const { data: uploadEvidenceData, error: uploadEvidenceError } = await uploadEvidence(
		ipcrAccomplishment.id,
		ipcr_indicator_id,
		data,
		user_id,
		pdf_evidence,
		supabase
	);

	if (uploadEvidenceError || !uploadEvidenceData) {
		//* Clean up if evidence upload fails
		await supabase.from('ipcr_indicator_accomplishment').delete().eq('id', ipcrAccomplishment.id);

		return message(form, {
			status: 'error',
			text: `Error uploading ipcr indicator evidence`
		});
	}

	//* Save to ipcr_indicator_evidence
	//* this table serves as a reference to the evidence uploaded
	const { error: saveIndicatorEvidenceError } = await supabase
		.from('ipcr_indicator_evidence')
		.insert({
			uploader_id: profile.id,
			accomplishment_indicator_id: accomplishmentActivityIndicatorId,
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
			text: `Error saving evidence`
		});
	}

	// Process blockchain
	try {
		await processIpcrEvidence(supabase, ipcrAccomplishment.id, 0);
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Error in blockchain processing ${error}`
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

//===== UPDATE ACCOMPLISHMENT =====/
export async function updateAccomplishment(request: Request, supabase: SupabaseClient<Database>) {
	//* Get the User Info
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) {
		return error(401, 'Unauthorized');
	}

	//* Check for form and validate
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

	//* get the data from form
	const { id, actual_accomplishments, accomplishment_date, pdf_evidence, quantity } = form.data;

	//* Update the accomplishment
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

	//* Update the history
	//* Update the history with the newly created accomplishment ID
	try {
		await updateAccomplishmentWithHistory(
			supabase,
			id, // ipcr indicator accomplishment id
			quantity,
			ipcrAccomplishment.ipcr_indicator_id
		);
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Error updating IPCR: ${error}`
		});
	}

	//* Upload evidence
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

	//* Update storage
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

	//* Process blockchain
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
