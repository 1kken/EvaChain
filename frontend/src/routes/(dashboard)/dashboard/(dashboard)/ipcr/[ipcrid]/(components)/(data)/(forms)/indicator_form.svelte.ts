import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateIndicatorSchema,
	MarkIndicatorDoneSchema,
	UpdateIndicatorSchema
} from '../../../utils/schemas/indicator_schema';
import { type UniversalDeleteSchema } from '../../../utils/schemas/universal_delete_schema';
import { getContext, setContext } from 'svelte';

const INDICATOR_FORM_KEY = Symbol('INDICATOR_FORM_KEY');

type IndicatorForm = {
	markIndicatorDoneForm: SuperValidated<Infer<MarkIndicatorDoneSchema>>;
	updateIndicatorForm: SuperValidated<Infer<UpdateIndicatorSchema>>;
	deleteIndicatorForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createIndicatorForm: SuperValidated<Infer<CreateIndicatorSchema>>;
};

export function setIndicatorFormContext(forms: IndicatorForm) {
	setContext(INDICATOR_FORM_KEY, forms);
	return forms;
}

export function getIndicatorFormContext() {
	const forms = getContext<IndicatorForm>(INDICATOR_FORM_KEY);
	if (!forms?.createIndicatorForm) {
		throw new Error('Indicator form not found in context');
	}
	return forms;
}
