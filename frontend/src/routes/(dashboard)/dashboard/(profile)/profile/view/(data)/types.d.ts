import type { Tables } from '$lib/types/database.types';

type ProfileResultForm = {
	form: any;
	profile: Tables<'profiles'>;
};
