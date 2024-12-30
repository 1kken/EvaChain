<script lang="ts">
	import Header from '../../components/Header.svelte';
	import type { PageData } from './$types';
	import IndexComponent from './components/IndexComponent.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setIpcrStore } from './states/current_ipcr_state';
	import { setIpcrFunctionCategoryFormContext } from './states/ipcr_category_form_state';
	import { setIpcrFunctionFormContext } from './states/ipcr_function_form_state';
	import { setIpcrFunctionStore } from './states/ipcr_function_state';
	import { setIpcrIndicatorFormContext } from './states/ipcr_indicator_form_state';
	import { setIpcrFunctionSubCategoryFormContext } from './states/ipcr_sub_category_form_state';

	let { data }: { data: PageData } = $props();
	//states
	setIpcrStore(data.currentIpcr);
	setIpcrFunctionStore(data.ipcrFunction);
	//forms states
	setIpcrFunctionFormContext(data.ipcrFunctionForm);
	setIpcrFunctionCategoryFormContext(data.ipcrFunctionCategoryForm);
	setIpcrIndicatorFormContext(data.ipcrIndicatorForm);
	setIpcrFunctionSubCategoryFormContext(data.ipcrFunctionSubCategoryForm);
</script>

<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header
			title={'Individual Performance Commitment and Review'}
			description={'View and manage your IPCR here.'}
		/>
		<IndexComponent />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton data={data.ipcrSubmitForm} />
	</div>
</div>
