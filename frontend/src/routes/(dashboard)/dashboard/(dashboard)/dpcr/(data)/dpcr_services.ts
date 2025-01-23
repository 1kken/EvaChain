import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createDpcrSchema,
	updateDpcrSchema,
	type CreateDpcrSchema,
	type UpdateDpcrSchema
} from './dpcr_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import { fetchProfile } from '$lib/utils/profileHelper';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
export async function createDPCR(
	request: Request,
	supabase: SupabaseClient<Database>,
	ownerId: string
) {
	const form = await superValidate<Infer<CreateDpcrSchema>, App.Superforms.Message>(
		request,
		zod(createDpcrSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { profile, profileError } = await fetchProfile(ownerId, supabase);
	if (profileError || !profile) {
		error(500, { message: 'Failed to fetch profile' });
	}
	const { unit_id, program_id, office_id } = profile;
	const { title, review_by, reviewer_position, assessors } = form.data;
	const data = {
		title,
		review_by,
		reviewer_position,
		unit_id,
		program_id,
		office_id,
		owner_id: ownerId
	};
	const { data: dpcr, error: insertError } = await supabase
		.from('dpcr')
		.insert({ ...data })
		.select()
		.single();

	if (insertError) {
		error(500, { message: 'Failed to insert DPCR' });
	}

	await insertAssesors(dpcr.id, assessors, supabase);

	return { form, dpcr };
}

export async function updateDPCR(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateDpcrSchema>, App.Superforms.Message>(
		request,
		zod(updateDpcrSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, title, review_by, reviewer_position, assessors } = form.data;
	const data = {
		title,
		review_by,
		reviewer_position
	};
	const { data: dpcr, error } = await supabase
		.from('dpcr')
		.update({ ...data })
		.eq('id', id)
		.select();

	if (error) {
		return message(form, { status: 'error', text: `Error creating Operational plan` });
	}

	if (assessors) {
		await counterCheckDeleteAssessor(id, assessors, supabase);
		console.log(assessors);
	}

	console.log('eneter');
	return { form, dpcr };
}

export async function deleteDPCR(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: dpcr, error } = await supabase.from('dpcr').delete().eq('id', id).select().single();

	if (error) {
		return message(form, { status: 'error', text: `Error creating Operational plan` });
	}

	return { form, dpcr };
}

interface Assessor {
	name: string;
	position: string;
	sequence: number;
}

export async function insertAssesors(
	dpcrID: string,
	assessors: Assessor[],
	supabase: SupabaseClient<Database>
) {
	const assessorsWithDPCRId = assessors.map((assessor) => ({ ...assessor, dpcr_id: dpcrID }));
	const { data, error: insertError } = await supabase
		.from('dpcr_assessor')
		.insert(assessorsWithDPCRId);
	if (insertError) {
		error(500, { message: 'Failed to insert assessors' });
	}
}

export async function counterCheckDeleteAssessor(
	dpcrID: string,
	assessors: Partial<Tables<'dpcr_assessor'>>[],
	supabase: SupabaseClient<Database>
) {
	const { data: assessorsData, error: fetchError } = await supabase
		.from('dpcr_assessor')
		.select()
		.eq('dpcr_id', dpcrID);

	if (fetchError) {
		error(500, { message: 'Failed to fetch assessors' });
	}

	const assessorsToDelete = assessorsData.filter((assessor) => {
		return !assessors.some((a) => a.id === assessor.id);
	});

	const { data: deleteData, error: deleteError } = await supabase
		.from('dpcr_assessor')
		.delete()
		.in(
			'id',
			assessorsToDelete.map((a) => a.id)
		);
	console.log(deleteData);
	if (deleteError) {
		error(500, { message: 'Failed to delete assessors' });
	}
}

async function updateEachAssessor(
	assessors: Partial<Tables<'dpcr_assessor'>>[],
	supabase: SupabaseClient<Database>
) {
	for (const assessor of assessors) {
		const { data, error: insertError } = await supabase
			.from('dpcr_assessor')
			.update(assessor)
			.eq('id', assessor.id)
			.select();
		if (insertError) {
			error(500, { message: 'Failed to update assessor' });
		}
	}
}
