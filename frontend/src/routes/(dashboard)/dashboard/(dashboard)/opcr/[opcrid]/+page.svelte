<script lang="ts">
	import Header from '../../components/Header.svelte';
	import type { PageData } from './$types';
	import Index from './components/index.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setOpcrCategoryFormContext } from './states/category_form_state';
	import { setOpcrFunctionFormContext } from './states/function_form_state';
	import { setOpcrFunctionStore } from './states/function_state';
	import { setOpcrIndicatorFormContext } from './states/indicator_form_state';
	import { setCurrentOpcrStore } from './states/opcr_state';

	let { data }: { data: PageData } = $props();
	const forms = data.forms;

	//states
	setCurrentOpcrStore(data.opcr);
	setOpcrFunctionStore(data.opcrFunctions);

	//form states
	setOpcrFunctionFormContext(forms.functionForms);
	setOpcrCategoryFormContext(forms.categoryForms);
	setOpcrIndicatorFormContext(forms.indicatorForms);
</script>

<!-- Main wrapper -->
<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header
			title={'Office Performance and Commitment Review'}
			description={'View and manage the OPCR forms of the office.'}
		/>
		<Index />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton />
	</div>
</div>
