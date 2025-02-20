<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { onMount } from 'svelte';
	import {
		fetchHeaderIndicators,
		fetchIndicatorsByIpcrActivityIndicator,
		fetchOpHeaders
	} from '../../../utils/page_loader_services';
	import type { Tables } from '$lib/types/database.types';
	import { showErrorToast } from '$lib/utils/toast';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Save } from 'lucide-svelte';

	let isOpen = $state(false);
	let opHeaders: Tables<'op_header'>[] = $state([]);
	let opIndicators: Tables<'op_header_indicators'>[] = $state([]);

	let selectedIndicator: Tables<'op_header_indicators'> | null = $state(null);

	let selectedHeaderId = $state('');
	let selectedHeader: Tables<'op_header'> | null = $state(null);

	interface Props {
		ipcrOpIndicatorId?: string;
		handleIpcrOpIndicator: (e: string) => void;
	}

	let props: Props = $props();

	onMount(() => {
		fetchOpHeaders()
			.then((result) => {
				if ('error' in result) {
					showErrorToast(result.error);
				} else {
					opHeaders = result;
					if (props.ipcrOpIndicatorId) {
						fetchIndicatorsByIpcrActivityIndicator(props.ipcrOpIndicatorId)
							.then((result) => {
								if ('error' in result) {
									showErrorToast(result.error);
								} else {
									//set the indicators
									opIndicators = result.data;
									selectedIndicator =
										opIndicators.find(
											(indicator) => indicator.indicator_id === props.ipcrOpIndicatorId
										) ?? null;
									selectedHeaderId = selectedIndicator?.header_id ?? '';
									selectedHeader =
										opHeaders.find((header) => header.id === selectedHeaderId) ?? null;
								}
							})
							.catch((error) => {
								showErrorToast('Failed to fetch indicators');
							});
					}
				}
			})
			.catch((error) => {
				showErrorToast('Failed to fetch headers');
			});
	});

	function handleHeaderChangeForIndicator(headerId: string) {
		fetchHeaderIndicators(headerId)
			.then((result) => {
				if ('error' in result) {
					showErrorToast(result.error);
				} else {
					opIndicators = result.data;
				}
			})
			.catch((error) => {
				showErrorToast('Failed to fetch indicators');
			});
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger
		type="button"
		class="w-full rounded border border-dashed p-4 transition-colors hover:bg-green-200"
	>
		{selectedIndicator
			? selectedIndicator.performance_indicator
			: 'Select Operational Plan Indicator'}
	</Dialog.Trigger>

	<Dialog.Content class="space-y-4">
		<Dialog.Header>
			<Dialog.Title>Select Operational Plan</Dialog.Title>
			<Dialog.Description>
				Select the operational plan performance indicator that aligns with the current IPCR function
				indicator.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-2">
			<Label>Choose Function</Label>
			<Select.Root
				type="single"
				bind:value={selectedHeaderId}
				onValueChange={() => {
					selectedHeader = opHeaders.find((header) => header.id === selectedHeaderId) ?? null;
					selectedHeaderId = selectedHeaderId;
					handleHeaderChangeForIndicator(selectedHeaderId);
				}}
			>
				<Select.Trigger
					class="w-full rounded-md border p-3 transition-colors hover:border-gray-400"
				>
					{selectedHeader?.title ?? 'Select Function...'}
				</Select.Trigger>
				<Select.Content class="max-h-[200px] overflow-y-auto">
					{#each opHeaders as header}
						<Select.Item value={header.id} class="p-2 hover:bg-gray-100">
							{header.title}
						</Select.Item>
					{:else}
						<Select.Item value={''} disabled class="p-2 italic text-gray-400">
							No Approved Operational Plan for this S.Y.
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="space-y-2">
			<Label>Choose Performance Indicator</Label>
			<Select.Root
				type="single"
				onValueChange={(e) => {
					props.handleIpcrOpIndicator(e);
					selectedIndicator =
						opIndicators.find((indicator) => indicator.indicator_id === e) ?? null;
				}}
			>
				<Select.Trigger
					class="w-full rounded-md border p-3 transition-colors hover:border-gray-400"
				>
					<span class="max-w-xs overflow-hidden truncate whitespace-nowrap">
						{selectedIndicator?.performance_indicator ?? 'Select Indicator...'}
					</span>
				</Select.Trigger>
				<Select.Content class="max-h-[200px] max-w-[500px] overflow-y-auto">
					{#if selectedHeaderId}
						{#each opIndicators as indicator}
							<Select.Item value={indicator.indicator_id!} class="hover:bg-green-700">
								{indicator.performance_indicator}
							</Select.Item>
						{/each}
					{:else}
						<Select.Item
							value={''}
							disabled
							class="whitespace-normal break-words p-2 italic text-gray-400"
						>
							Please select function first
						</Select.Item>
					{/if}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex justify-end">
			<Button
				onclick={() => (isOpen = false)}
				class="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
			>
				<Save class="mr-2 h-4 w-4" />Save
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
