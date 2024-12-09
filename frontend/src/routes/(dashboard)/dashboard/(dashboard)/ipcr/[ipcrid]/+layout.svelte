<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { setCoreFunctionStore } from './(components)/(data)/(state)/corefunctionstate.svelte';
	import { setCoreFunctionFormContext } from './(components)/(data)/(forms)/core_function_form.svelte';
	import { setSubCoreFunctionFormContext } from './(components)/(data)/(forms)/sub_core_function_form.svelte';
	import { setIndicatorFormContext } from './(components)/(data)/indicator_form.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { ipcrId } = data;
	const { coreFunctions } = data.data;
	const { createCoreFunctionForm, deleteCoreFunctionForm, updateCoreFunctionForm } = data.coreForms;
	const { createSubCoreFunctionForm, deleteSubCoreFunctionForm, updateSubCoreFunctionForm } =
		data.subCoreForms;
	const { createIndicatorForm, updateIndicatorForm, deleteIndicatorForm } = data.indicatorForm;
	setCoreFunctionStore(coreFunctions);
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
	setIndicatorFormContext({
		updateIndicatorForm,
		createIndicatorForm,
		deleteIndicatorForm
	});
</script>

{@render children()}
