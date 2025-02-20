<script lang="ts">
	import Header from '../../components/Header.svelte';
	import type { PageData } from './$types';
	import Index from './components/Index.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setAccomplishmentActivityFormContext } from './states/activity_form_state';
	import { setAccomplishmentActivityIndicatorFormContext } from './states/activity_indicator_form_state';
	import { setAccomplishmentAnnualPlanFormContext } from './states/annual_plan_form_state';
	import { setCurrentAccomplishmentReportStore } from './states/current_accomplishment_report_state';
	import { setAccomplishmentHeaderFormContext } from './states/header_form_state';
	import { setAccomplishmentHeaderStore } from './states/header_state';

	let { data }: { data: PageData } = $props();
	//data form
	setAccomplishmentHeaderFormContext(data.form.accomplishmentHeaderForms);
	setAccomplishmentAnnualPlanFormContext(data.form.accomplishmentAnnualPlanForms);
	setAccomplishmentActivityFormContext(data.form.accomplishmentActivityForms);
	setAccomplishmentActivityIndicatorFormContext(data.form.accomplishmentActivityIndicatorForms);
	//data store
	setCurrentAccomplishmentReportStore(data.accomplishmentReport);
	setAccomplishmentHeaderStore(data.accomplishmentHeader);
</script>

<!-- Main wrapper -->
<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header
			title={'Accomplishment Report'}
			description={'Manage and update the accomplishment reports.'}
		/>
		<Index />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton />
	</div>
</div>
