<script lang="ts">
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import { getOpObjectiveFormContext } from '../states/op_objective_form_state';
	import { getOpObjectiveStore } from '../states/op_objective_state';
	import UpdateDialog from './sub_components/op_objectives/UpdateDialog.svelte';

	let { opObjective }: { opObjective: Tables<'op_objectives'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { removeOpObjective } = getOpObjectiveStore();
	const { deleteForm } = getOpObjectiveFormContext();

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.opObjective) {
			const opObjective = result.data.opObjective;
			removeOpObjective(opObjective.id);
			showWarningToast(`Successfully deleted ${opObjective.objective}`);
		}
	}
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-16 items-center justify-between px-4 md:px-10">
		<h2 class="text-sm">{opObjective.objective}</h2>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opObjective.id}
					action="?/deleteopobjective"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {opObjective} />
			{/snippet}
			<div class="flex gap-4">
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>
</div>
