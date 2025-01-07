<script lang="ts">
	import Header from '../components/Header.svelte';
	import type { PageData } from './$types';
	import Index from './components/Index.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setCurrentAccomplishmentReportTemplateStore } from './states/accomplishment_report_state';
	import { setAccomplishmentMetricTemplateFormContext } from './states/metrics_form_state';
	import { setAccomplishmentProgramProjectTemplateFormContext } from './states/program_project_form_state';
	import { setAccomplishmentProgramProjectTemplateStore } from './states/program_project_state';
	let { data }: { data: PageData } = $props();

	const publishActionForm = data.forms.publishActionsForm.publishForm;
	//states
	setAccomplishmentProgramProjectTemplateStore(data.programProjects);
	const { canEdit } = setCurrentAccomplishmentReportTemplateStore(data.accomplishmentReport);
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
			showBadge={true}
			badgeText={$canEdit ? 'Unpublished' : 'Published'}
		/>
		<Index />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton {publishActionForm} />
	</div>
</div>
