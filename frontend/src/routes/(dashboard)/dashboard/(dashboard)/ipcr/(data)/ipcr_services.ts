import type { Database } from '$lib/types/database.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createIPCRSchema,
	deleteIPCRSchema,
	type CreateIPCRSchema,
	type DeleteIPCRSchemanType
} from './schema';
import { zod } from 'sveltekit-superforms/adapters';

//fetch profile
async function fetchProfile(owner_id: string, supabase: SupabaseClient<Database>) {
	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select()
		.eq('id', owner_id)
		.single();
	return { profile, profileError };
}

function createTitle(last_name: string) {
	const currentYear = new Date().getFullYear();
	const lastName = last_name;
	return `${lastName}_${currentYear}_January_June`;
}

async function createCoreFunction(supabase: SupabaseClient<Database>, ipcrId: string) {
	const { data, error } = await supabase
		.from('ipcr_function')
		.insert({ ipcr_id: ipcrId, title: 'Core Functions', position: 0 })
		.select();

	return { data, error };
}

export async function createIPCR(
	request: Request,
	supabase: SupabaseClient<Database>,
	session: Session
) {
	const form = await superValidate<Infer<CreateIPCRSchema>, App.Superforms.Message>(
		request,
		zod(createIPCRSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { owner_id } = form.data;
	//check if the same user
	if (owner_id !== session?.user.id) {
		return message(form, {
			status: 'error',
			text: 'User is not the same in tehserver please refresh the page!'
		});
	}

	//fetch the user
	const { profile, profileError } = await fetchProfile(owner_id, supabase);

	if (profileError || !profile) {
		return message(form, {
			status: 'error',
			text: 'Error fetching user profile, please log in again!'
		});
	}
	const { unit_id, office_id, program_id } = profile;

	//create a title
	if (!profile.last_name) {
		return message(form, {
			status: 'error',
			text: 'Error fetching user profile, please log in again!'
		});
	}

	const title = createTitle(profile.last_name);

	//create the ipcr
	const { data: ipcrData, error: ipcrError } = await supabase
		.from('ipcr')
		.insert({ title, owner_id, unit_id, office_id, program_id })
		.select()
		.single();

	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: 'Error creating IPCR!'
		});
	}

	//create core function
	const { data: coreFunctionData, error: coreFunctionError } = await createCoreFunction(
		supabase,
		ipcrData.id
	);
	if (coreFunctionError) {
		return message(form, {
			status: 'error',
			text: 'Error creating IPCR!'
		});
	}

	return { form, ipcrData };
}

export async function deleteIPCR(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<DeleteIPCRSchemanType>, App.Superforms.Message>(
		request,
		zod(deleteIPCRSchema)
	);
	const { id } = form.data;

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { error: deleteError, data: deletedIPCR } = await supabase
		.from('ipcr')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (deleteError) {
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${deleteError}`
		});
	}
	return { form, deletedIPCR };
}
//delete ipcr
// export async deleteIPCRSchema(request: Request, supabase: SupabaseClient<Database>) {
// }
