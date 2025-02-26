<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Eye, FileText, Loader, Plus } from 'lucide-svelte';
	import type { Tables } from '$lib/types/database.types';
	import {
		fetchAccomplishments,
		fetchIndicatorsByIpcrActivityIndicator
	} from '../../../utils/page-helper-loader';
	import View from './accomplishments/view.svelte';
	import { onMount } from 'svelte';

	interface Props {
		indicator: Tables<'ipcr_indicator'>;
	}

	let props: Props = $props();

	let opIndicator: Tables<'op_header_indicators'> | null = $state(null);
	let isLoading = $state(false);

	onMount(() => {
		isLoading = true;
		fetchIndicatorsByIpcrActivityIndicator(props.indicator.op_activity_indicator_id)
			.then((result) => {
				opIndicator =
					result.find(
						(indicator) => indicator.indicator_id === props.indicator.op_activity_indicator_id
					) ?? null;
			})
			.catch((error) => {
				console.error('Error loading indicators:', error);
			})
			.finally(() => {
				isLoading = false;
			});
	});
</script>

<Dialog.Root>
	<Dialog.Trigger
		type="button"
		class="mb-1 w-full rounded-lg border border-dashed p-1 text-center transition  duration-300 hover:bg-green-200  dark:hover:bg-green-700 "
	>
		<span class="text-md flex w-full items-center justify-center text-center">
			<Eye size="16" class="mr-2" />
			View Accomplishments
		</span>
	</Dialog.Trigger>

	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Accomplishments</Dialog.Title>
			<Dialog.Description>
				This are the accomplishments of the indicator filtered by the current Quarter.
			</Dialog.Description>
		</Dialog.Header>

		{#await fetchAccomplishments(props.indicator.id)}
			<div class="flex h-40 items-center justify-center">
				<Loader />
			</div>
		{:then accomplishments}
			{#if accomplishments.length === 0}
				<div class="flex h-40 items-center justify-center">
					<span class="text-sm">No accomplishments yet</span>
				</div>
			{:else}
				<div class="space-y-2">
					{#each accomplishments as accomplishment}
						<div
							class="group flex items-center justify-between rounded-md border bg-white p-3 shadow-sm hover:shadow-md dark:bg-inherit"
						>
							<div class="flex items-center space-x-3">
								<div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
									<FileText class="h-4 w-4 text-gray-500" />
								</div>
								<span class="text-sm text-gray-700 dark:text-white"
									>{accomplishment.actual_accomplishments}</span
								>
							</div>
							<div
								class="flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100"
							>
								{#if !isLoading}
									{#if opIndicator}
										<View {accomplishment} {opIndicator} />
									{/if}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{:catch error}
			<div class="flex h-40 items-center justify-center">
				<span class="text-sm text-red-500">Failed to load accomplishments</span>
			</div>
		{/await}
	</Dialog.Content>
</Dialog.Root>
