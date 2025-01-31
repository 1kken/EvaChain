import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type {
	CreateOpcrIndicatorSchema,
	UpdateOpcrIndicatorSchema
} from '../schema/indicator_schema';

const OPCR_INDICATOR_FORM_KEY = Symbol('OPCR_INDICATOR_FORM_KEY');

type OpcrIndicatorForm = {
	updateForm: SuperValidated<Infer<UpdateOpcrIndicatorSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpcrIndicatorSchema>>;
};

export function setOpcrIndicatorFormContext(forms: OpcrIndicatorForm) {
	setContext(OPCR_INDICATOR_FORM_KEY, forms);
	return forms;
}

export function getOpcrIndicatorFormContext() {
	const forms = getContext<OpcrIndicatorForm>(OPCR_INDICATOR_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('OPCR Indicator form not found in context');
	}
	return forms;
}
