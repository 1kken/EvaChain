<script lang="ts">
	import { setAccomplishmentProgramProjectFormContext } from '../../../(dashboard)/accomplishment_report/[accomplishmentId]/states/program_project_form_state';
	import Header from '../components/Header.svelte';
	import type { PageData } from './$types';
	import Index from './components/Index.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setCurrentAccomplishmentReportTemplateStore } from './states/accomplishment_report_state';
	import { setAccomplishmentMetricTemplateFormContext } from './states/metrics_form_state';
	import { setAccomplishmentProgramProjectTemplateFormContext } from './states/program_project_form_state';
	import { setAccomplishmentProgramProjectTemplateStore } from './states/program_project_state';
	let { data }: { data: PageData } = $props();

	//states
	setAccomplishmentProgramProjectTemplateStore(data.programProjects);
	setCurrentAccomplishmentReportTemplateStore(data.accomplishmentReport);
	//form states
	setAccomplishmentProgramProjectTemplateFormContext(data.forms.programProjectForms);
	setAccomplishmentMetricTemplateFormContext(data.forms.metricForms);
</script>

<!-- Main wrapper -->
<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header
			title={'Accomplishment Report Template'}
			description={'Create and manage the accomplishment report template'}
		/>
		<Index />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton />
	</div>
</div>
