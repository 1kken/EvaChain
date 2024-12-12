// src/lib/utils/form-initialization.ts
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCoreFunctionSchema, updateCoreFunctionSchema } from './schemas/core_function_schema';
import {
	createSubCoreFunctionSchema,
	updateSubCoreFunctionSchema
} from './schemas/sub_core_function_schema';
import {
	createIndicatorSchema,
	updateIndicatorSchema,
	markIndicatorDoneSchema
} from './schemas/indicator_schema';
import {
	createSupportFunctionSchema,
	updateSupportFunctionSchema
} from './schemas/support_function_schema';
import { universalDeleteSchema } from './schemas/universal_delete_schema';
import {
	createSubSupportFunctionSchema,
	updateSubSupportFunctionSchema
} from './schemas/sub_support_function_schema';
import {
	createOtherFunctionSchema,
	updateOtherFunctionSchema
} from './schemas/other_function_schema';
import {
	createSubOtherFunctionSchema,
	updateSubOtherFunctionSchema
} from './schemas/sub_other_function_schema';

export async function getCoreFunctionForms() {
	return {
		createForm: await superValidate(zod(createCoreFunctionSchema)),
		updateForm: await superValidate(zod(updateCoreFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getSubCoreFunctionForms() {
	return {
		createForm: await superValidate(zod(createSubCoreFunctionSchema)),
		updateForm: await superValidate(zod(updateSubCoreFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getIndicatorForms() {
	return {
		createForm: await superValidate(zod(createIndicatorSchema)),
		updateForm: await superValidate(zod(updateIndicatorSchema)),
		markDoneForm: await superValidate(zod(markIndicatorDoneSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getSupportFunctionForms() {
	return {
		createForm: await superValidate(zod(createSupportFunctionSchema)),
		updateForm: await superValidate(zod(updateSupportFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getSubSupportFunctionForms() {
	return {
		createForm: await superValidate(zod(createSubSupportFunctionSchema)),
		updateForm: await superValidate(zod(updateSubSupportFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getOtherFunctionForms() {
	return {
		createForm: await superValidate(zod(createOtherFunctionSchema)),
		updateForm: await superValidate(zod(updateOtherFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getSubOtherFunctionForms() {
	return {
		createForm: await superValidate(zod(createSubOtherFunctionSchema)),
		updateForm: await superValidate(zod(updateSubOtherFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
