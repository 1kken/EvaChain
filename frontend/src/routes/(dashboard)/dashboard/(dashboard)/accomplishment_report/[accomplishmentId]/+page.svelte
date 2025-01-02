<script lang="ts">
	import Header from '../../components/Header.svelte';
	import type { PageData } from './$types';
	import Index from './components/Index.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setCurrentAccomplishmentReportStore } from './states/current_accomplishment_report_state';
	import { setAccomplishmentMetricFormContext } from './states/metrics_form_state';
	import { setAccomplishmentProgramProjectFormContext } from './states/program_project_form_state';
	import { setAccomplishmentProgramProjectStore } from './states/program_project_state';

	let { data }: { data: PageData } = $props();
	setCurrentAccomplishmentReportStore(data.accomplishmentReport);
	setAccomplishmentProgramProjectStore(data.programProjects);
	setAccomplishmentProgramProjectFormContext(data.programProjectForms);
	setAccomplishmentMetricFormContext(data.metricsForms);
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
