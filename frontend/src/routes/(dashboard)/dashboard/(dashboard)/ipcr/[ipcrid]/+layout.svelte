<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { setCoreFunctionStore } from './(components)/(data)/(state)/corefunctionstate.svelte';
	import { setCoreFunctionFormContext } from './(components)/(data)/(forms)/core_function_form.svelte';
	import { setSubCoreFunctionFormContext } from './(components)/(data)/(forms)/sub_core_function_form.svelte';
	import { setIndicatorFormContext } from './(components)/(data)/(forms)/indicator_form.svelte';
	import { setSupportFunctionStore } from './(components)/(data)/(state)/support_function_state.svelte';
	import { setSingleIPCRStore } from './(components)/(data)/(state)/ipcr-state.svelte';
	import { setSupportFunctionFormContext } from './(components)/(data)/(forms)/support_function_form.svelte';
	import { setSubSupportFunctionFormContext } from './(components)/(data)/(forms)/sub_support_function_form.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { IPCR, coreFunctions, supportFunctions } = data.data;
	const { createCoreFunctionForm, deleteCoreFunctionForm, updateCoreFunctionForm } = data.coreForms;
	const { createSubCoreFunctionForm, deleteSubCoreFunctionForm, updateSubCoreFunctionForm } =
		data.subCoreForms;
	const { createIndicatorForm, updateIndicatorForm, deleteIndicatorForm, markIndicatorDoneForm } =
		data.indicatorForm;
	const { createSupportFunctionForm, updateSupportFunctionForm, deleteSupportFunctionForm } =
		data.supportForms;
	const {
		createSubSupportFunctionForm,
		updateSubSupportFunctionForm,
		deleteSubSupportFunctionForm
	} = data.subSupportForms;
	//states
	setCoreFunctionStore(coreFunctions);
	setSupportFunctionStore(supportFunctions);
	setSingleIPCRStore(IPCR);

	//forms
	setCoreFunctionFormContext({
		updateCoreFunctionForm,
		createCoreFunctionForm,
		deleteCoreFunctionForm
	});
	setSubCoreFunctionFormContext({
		updateSubCoreFunctionForm,
		createSubCoreFunctionForm,
		deleteSubCoreFunctionForm
	});
	setSupportFunctionFormContext({
		updateSupportFunctionForm,
		createSupportFunctionForm,
		deleteSupportFunctionForm
	});
	setIndicatorFormContext({
		markIndicatorDoneForm,
		updateIndicatorForm,
		createIndicatorForm,
		deleteIndicatorForm
	});
	setSubSupportFunctionFormContext({
		updateSubSupportFunctionForm,
		createSubSupportFunctionForm,
		deleteSubSupportFunctionForm
	});
</script>

{@render children()}
