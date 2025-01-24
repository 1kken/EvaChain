import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateDpcrIndicatorSchema,
	UpdateDpcrIndicatorSchema
} from '../schema/indicator_schema';

const DPCR_INDICATOR_FORM_KEY = Symbol('DPCR_INDICATOR_FORM_KEY');

type DpcrIndicatorForm = {
	updateForm: SuperValidated<Infer<UpdateDpcrIndicatorSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateDpcrIndicatorSchema>>;
};

export function setDpcrIndicatorFormContext(forms: DpcrIndicatorForm) {
	setContext(DPCR_INDICATOR_FORM_KEY, forms);
	return forms;
}

export function getDpcrIndicatorFormContext() {
	const forms = getContext<DpcrIndicatorForm>(DPCR_INDICATOR_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('DPCR Indicator form not found in context');
	}
	return forms;
}
