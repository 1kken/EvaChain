import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// const ipcr = (async () => await supabase.from('ipcr').select().eq('id', ipcrId).single())();
// ipcr.catch(() => {});
export const load = (async ({ params, locals: { supabase, session } }) => {
	const ipcrId = params.ipcrid;
	// if (!ipcrId) {
	// 	error(422, { message: 'IPCR id is missing' });
	// }
	// const ipcr = (async () => await supabase.from('ipcr').select().eq('id', ipcrId).single())();
	// ipcr.catch(() => {});
	// const superVisors = await supabase.from()
	const { data, error } = await supabase
		.from('user_roles')
		.select(
			`
    user_id,
    roles!inner (
      id,
      role_permissions!inner (
        permissions!inner (
          name
        )
      )
    )
  `
		)
		.eq('roles.role_permissions.permissions.name', 'review_ipcr');
	return { data };
}) satisfies PageServerLoad;
