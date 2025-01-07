<script lang="ts">
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import PublishTemplate from './PublishTemplate.svelte';
	import Create from './sub_components/program_project/Create.svelte';
	import type { TemplatePublishAction } from '../schema/accomplishment_template_schema';
	import { getCurrentAccomplishmentReportTemplateStore } from '../states/accomplishment_report_state';
	import UnpublishTemplate from './UnpublishTemplate.svelte';
	//props
	let { publishActionForm }: { publishActionForm: SuperValidated<Infer<TemplatePublishAction>> } =
		$props();

	//store
	const { canEdit } = getCurrentAccomplishmentReportTemplateStore();
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<Create />
		{#if $canEdit}
			<PublishTemplate {publishActionForm} />
		{:else}
			<UnpublishTemplate {publishActionForm} />
		{/if}
	</div>
</NavButtonGroup>
