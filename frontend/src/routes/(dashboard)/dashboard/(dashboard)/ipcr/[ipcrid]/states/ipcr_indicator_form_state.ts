import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateIpcrIndicatorSchema,
	MarkIndicatorDoneSchema,
	UpdateIpcrIndicatorSchema
} from '../schema/ipcr_indicator_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const IPCR_INDICATOR_FORM_KEY = Symbol('IPCR_INDICATOR_FORM_KEY');

type IpcrIndicatorForm = {
	updateForm: SuperValidated<Infer<UpdateIpcrIndicatorSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	markDoneForm: SuperValidated<Infer<MarkIndicatorDoneSchema>>;
	createForm: SuperValidated<Infer<CreateIpcrIndicatorSchema>>;
};

export function setIpcrIndicatorFormContext(forms: IpcrIndicatorForm) {
	setContext(IPCR_INDICATOR_FORM_KEY, forms);
	return forms;
}

export function getIpcrIndicatorFormContext() {
	const forms = getContext<IpcrIndicatorForm>(IPCR_INDICATOR_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('IPCR Indicator form not found in context');
	}
	return forms;
}
