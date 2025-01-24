<script lang="ts">
	import Header from '../../components/Header.svelte';
	import type { PageData } from './$types';
	import Index from './components/index.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setDpcrCategoryFormContext } from './states/category_form_state';
	import { setCurrentDpcrStore } from './states/dpcr_state';
	import { setDpcrFunctionFormContext } from './states/function_form_state';
	import { setDpcrFunctionStore } from './states/function_state';
	import { setDpcrIndicatorFormContext } from './states/indicator_form_state';

	let { data }: { data: PageData } = $props();
	const forms = data.forms;

	//states
	setCurrentDpcrStore(data.dpcr);
	setDpcrFunctionStore(data.dpcrFunctions);

	//form states
	setDpcrFunctionFormContext(forms.functionForms);
	setDpcrCategoryFormContext(forms.categoryForms);
	setDpcrIndicatorFormContext(forms.indicatorForms);
</script>

<!-- Main wrapper -->
<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header
			title={'Department Performance and Commitment Review'}
			description={'View and manage the DPCR forms of the department.'}
		/>
		<Index />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton />
	</div>
</div>
