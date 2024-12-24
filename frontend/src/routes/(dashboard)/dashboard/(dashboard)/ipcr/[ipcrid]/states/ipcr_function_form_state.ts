import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateIpcrFunctionSchema,
	UpdateIpcrFunctionSchema
} from '../schema/ipcr_function_schema';
import { getContext, setContext } from 'svelte';
import type { UniversalDeleteSchema } from '$lib/schemas/universal_delete_schema';

const IPCR_FUNCTION_FORM_KEY = Symbol('IPCR_FUNCTION_FORM_KEY');

type IpcrFunctionForm = {
	updateForm: SuperValidated<Infer<UpdateIpcrFunctionSchema>>;
	deleteForm: SuperValidated<Infer<UniversalDeleteSchema>>;
	createForm: SuperValidated<Infer<CreateIpcrFunctionSchema>>;
};

export function setIpcrFunctionFormContext(forms: IpcrFunctionForm) {
	setContext(IPCR_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getIpcrFunctionFormContext() {
	const forms = getContext<IpcrFunctionForm>(IPCR_FUNCTION_FORM_KEY);
	if (!forms?.createForm) {
		throw new Error('IPCR Function form not found in context');
	}
	return forms;
}
