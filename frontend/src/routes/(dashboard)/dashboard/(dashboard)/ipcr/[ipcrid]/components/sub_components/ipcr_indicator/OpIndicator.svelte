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
	let selectedHeaderId = $state('');
	let selectedHeader: Tables<'op_header'> | null = $state(null);
	let selectedIndicator: Tables<'op_header_indicators'> | null = $state(null);

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
				}
			})
			.catch((error) => {
				showErrorToast('Failed to fetch headers');
			});
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
						selectedHeader = opHeaders.find((header) => header.id === selectedHeaderId) ?? null;
					}
				})
				.catch((error) => {
					showErrorToast('Failed to fetch indicators');
				});
		}
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
	// $inspect(selectedIndicator);
	$inspect(selectedHeader);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger type="button" class="w-full rounded border border-dashed p-4 hover:bg-green-200"
		>{selectedIndicator
			? selectedIndicator.performance_indicator
			: 'Select Operational Plan Indicator'}</Dialog.Trigger
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Select Operational Plan</Dialog.Title>
			<Dialog.Description>
				Select the operational plan performance indicator that aligns with the current IPCR function
				indicator.
			</Dialog.Description>
		</Dialog.Header>
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
			<Select.Trigger class="w-full rounded border border-dashed p-4 hover:bg-green-200">
				{selectedHeader?.title ?? 'Select Function...'}
			</Select.Trigger>
			<Select.Content>
				{#each opHeaders as header}
					<Select.Item value={header.id}>{header.title}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Label>Choose Performance Indicator</Label>
		<Select.Root
			type="single"
			onValueChange={(e) => {
				props.handleIpcrOpIndicator(e);
				selectedIndicator = opIndicators.find((indicator) => indicator.indicator_id === e) ?? null;
			}}
		>
			<Select.Trigger class="w-full rounded border border-dashed p-4 hover:bg-green-200">
				{selectedIndicator?.performance_indicator ?? 'Select Indicator...'}
			</Select.Trigger>
			<Select.Content class="max-h-[150px] overflow-y-auto">
				{#if selectedHeaderId}
					{#each opIndicators as indicator}
						<Select.Item value={indicator.indicator_id!}>
							{indicator.performance_indicator}
						</Select.Item>
					{/each}
				{:else}
					<Select.Item value={''} disabled>"Please select function first"</Select.Item>
				{/if}
			</Select.Content>
		</Select.Root>
		<Button
			onclick={() => {
				isOpen = false;
			}}
		>
			<Save />Save</Button
		>
	</Dialog.Content>
</Dialog.Root>
