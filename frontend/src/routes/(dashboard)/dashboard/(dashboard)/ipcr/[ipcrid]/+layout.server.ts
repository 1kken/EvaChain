import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { submitIPCRschema } from './utils/schemas/submit_ipcr_schema';
import {
	getCoreFunctionForms,
	getSubCoreFunctionForms,
	getIndicatorForms,
	getSupportFunctionForms
} from './utils/super_form_loader';
import { getCoreFunctions, getIPCR, getSupportFunctions } from './utils/layout_data_loader';

export const load = (async ({ params, locals: { supabase, safeGetSession } }) => {
	const ipcrId = params.ipcrid;
	if (!ipcrId) {
		error(404, {
			message: 'IPCR id is missing'
		});
	}

	try {
		const [
			coreForms,
			subCoreForms,
			indicatorForms,
			supportForms,
			submitIPCRForm,
			IPCR,
			coreFunctions,
			supportFunctions
		] = await Promise.all([
			getCoreFunctionForms(),
			getSubCoreFunctionForms(),
			getIndicatorForms(),
			getSupportFunctionForms(),
			superValidate(zod(submitIPCRschema)),
			getIPCR(supabase, ipcrId),
			getCoreFunctions(supabase, ipcrId),
			getSupportFunctions(supabase, ipcrId)
		]);

		return {
			IPCR,
			data: { coreFunctions, supportFunctions },
			coreForms: {
				createCoreFunctionForm: coreForms.createForm,
				deleteCoreFunctionForm: coreForms.deleteForm,
				updateCoreFunctionForm: coreForms.updateForm
			},
			subCoreForms: {
				createSubCoreFunctionForm: subCoreForms.createForm,
				deleteSubCoreFunctionForm: subCoreForms.deleteForm,
				updateSubCoreFunctionForm: subCoreForms.updateForm
			},
			supportForms: {
				createSupportFunctionForm: supportForms.createForm,
				deleteSupportFunctionForm: supportForms.deleteForm,
				updateSupportFunctionForm: supportForms.updateForm
			},
			indicatorForm: {
				createIndicatorForm: indicatorForms.createForm,
				deleteIndicatorForm: indicatorForms.deleteForm,
				updateIndicatorForm: indicatorForms.updateForm,
				markIndicatorDoneForm: indicatorForms.markDoneForm
			},
			ipcrForm: {
				submitIPCRForm
			}
		};
	} catch (err) {
		console.error('Unexpected error in load function:', err);
		throw error(500, 'An unexpected error occurred while loading the page');
	}
}) satisfies LayoutServerLoad;
