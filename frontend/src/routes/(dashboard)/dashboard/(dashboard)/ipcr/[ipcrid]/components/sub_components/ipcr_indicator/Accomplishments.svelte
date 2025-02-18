<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { FileText, Loader, Pencil, Plus, Trash2, X } from 'lucide-svelte';
	import {
		fetchAccomplishments,
		fetchIndicatorsByIpcrActivityIndicator
	} from '../../../utils/page_loader_services';
	import { setIpcrAccomplishmentStore } from '../../../states/ipcr_indicator_accomplishment_state';
	import { onMount } from 'svelte';
	import { showErrorToast } from '$lib/utils/toast';
	import Create from './accomplishments/Create.svelte';
	import type { Tables } from '$lib/types/database.types';
	import Update from './accomplishments/Update.svelte';

	interface Props {
		indicator: Tables<'ipcr_indicator'>;
	}

	let props: Props = $props();

	let { currentAccomplishments } = setIpcrAccomplishmentStore();
	let isLoading = $state(false);
	let isOpen = $state(false);
	let opIndicator: Tables<'op_header_indicators'> | null = $state(null);

	onMount(() => {
		isLoading = true;
		fetchAccomplishments(props.indicator.id)
			.then((result) => {
				if ('error' in result) {
					showErrorToast(result.error);
				} else {
					$currentAccomplishments = result;
				}
			})
			.catch((error) => {
				console.log('Failed to fetch accomplishments');
				isLoading = false;
			});
		fetchIndicatorsByIpcrActivityIndicator(props.indicator.op_activity_indicator_id)
			.then((result) => {
				if ('error' in result) {
					showErrorToast(result.error);
				} else {
					opIndicator =
						result.data.find(
							(indicator) => indicator.indicator_id === props.indicator.op_activity_indicator_id
						) ?? null;
				}
			})
			.catch((error) => {
				showErrorToast('Failed to fetch indicators');
				isLoading = false;
			});
		isLoading = false;
	});
</script>

<Dialog.Root>
	<Dialog.Trigger class="mb-1 rounded-lg border border-dashed p-1 hover:bg-green-200">
		<span class="flex items-center space-x-2 text-sm">
			<Plus size="16" /> Add Accomplishments
		</span>
	</Dialog.Trigger>

	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Accomplishments</Dialog.Title>
			<Dialog.Description>
				This are the accomplishments of the indicator filtered by the current Quarter.
			</Dialog.Description>
		</Dialog.Header>

		{#if $currentAccomplishments.length === 0}
			<div class="flex h-40 items-center justify-center">
				{#if isLoading}
					<Loader />
				{:else}
					<span class="text-sm">No accomplishments yet</span>
				{/if}
			</div>
		{:else}
			<div class="space-y-2">
				{#each $currentAccomplishments as accomplishment}
					<div
						class="group flex items-center justify-between rounded-md border bg-white p-3 shadow-sm hover:shadow-md"
					>
						<div class="flex items-center space-x-3">
							<div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
								<FileText class="h-4 w-4 text-gray-500" />
							</div>
							<span class="text-sm text-gray-700">{accomplishment.actual_accomplishments}</span>
						</div>
						<div
							class="flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100"
						>
							{#if opIndicator !== null}
								<Update {accomplishment} {opIndicator} />
							{/if}
							<button class="rounded-full p-1.5 hover:bg-gray-100">
								<Trash2 class="h-4 w-4 text-red-500" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if opIndicator !== null}
			<Create indicator={props.indicator} {opIndicator} bind:isOpen />
		{/if}
	</Dialog.Content>
</Dialog.Root>
