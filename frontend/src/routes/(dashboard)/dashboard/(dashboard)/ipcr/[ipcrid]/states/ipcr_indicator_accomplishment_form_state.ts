import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateAccomplishmentSchema,
	UpdateAccomplishmentSchema
} from '../schema/ipcr_indicator_accomplishmet';

const IPCR_ACCOMPLISHMENT_FORM_KEY = Symbol('IPCR_ACCOMPLISHMENT_FORM_KEY');

type IpcrAccomplishmentForm = {
	updateForm: SuperValidated<Infer<UpdateAccomplishmentSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateAccomplishmentSchema>>;
};

export function setIpcrAccomplishmentFormContext(forms: IpcrAccomplishmentForm) {
	setContext(IPCR_ACCOMPLISHMENT_FORM_KEY, forms);
	return forms;
}

export function getIpcrAccomplishmentFormContext() {
	const forms = getContext<IpcrAccomplishmentForm>(IPCR_ACCOMPLISHMENT_FORM_KEY);
	if (!forms?.createForm || !forms?.updateForm || !forms?.deleteForm) {
		throw new Error('One or more IPCR Accomplishment forms are missing in context');
	}
	return forms;
}
