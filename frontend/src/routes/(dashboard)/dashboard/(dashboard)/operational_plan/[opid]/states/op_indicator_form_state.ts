import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateOpActivityIndicatorSchema,
	UpdateOpActivityIndicatorSchema
} from '../schema/op_indicator_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const OP_INDICATOR_FORM_KEY = Symbol('OP_INDICATOR_FORM_KEY');

type OpIndicatorForm = {
	updateForm: SuperValidated<Infer<UpdateOpActivityIndicatorSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateOpActivityIndicatorSchema>>;
};

export function setOpIndicatorFormContext(forms: OpIndicatorForm) {
	setContext(OP_INDICATOR_FORM_KEY, forms);
	return forms;
}

export function getOpIndicatorFormContext() {
	const forms = getContext<OpIndicatorForm>(OP_INDICATOR_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('Op Indicator form not found in context');
	}
	return forms;
}
