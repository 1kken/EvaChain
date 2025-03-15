<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { showErrorToast } from '$lib/utils/toast';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Eye } from 'lucide-svelte';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
	import { onMount, onDestroy } from 'svelte';
	import { getIpcrIndicatorEvidence } from './helper';
	import PdfViewer from './pdf-viewer.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';

	interface Props {
		accomplishment: Tables<'ipcr_indicator_accomplishment'>;
		opIndicator: Tables<'op_header_indicators'>;
	}

	let { accomplishment, opIndicator }: Props = $props();
	let isOpen = $state(false);
	let badgeColor = $state<string>('');
	let confidenceLevel = $state<number | null>(null);
	let evidenceUrl = $state<string | null>(null);

	onMount(() => {
		getIpcrIndicatorEvidence(accomplishment.id)
			.then((evidence) => {
				if (evidence.signedUrl) {
					evidenceUrl = evidence.signedUrl;
				}

				if (evidence.confidenceLevel) {
					console.log(evidence.confidenceLevel);
					confidenceLevel = evidence.confidenceLevel;
				}
			})
			.catch((e) => {
				showErrorToast(`Error fetching evidence ${e}`);
			});
	});

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	// Format accomplishment date for display
	let formattedDate = $state('');
	if (accomplishment.accomplishment_date) {
		const dateValue = parseDate(accomplishment.accomplishment_date);
		formattedDate = df.format(dateValue.toDate(getLocalTimeZone()));
	}

	// Add this function to calculate the badge color
	function calculateBadgeColor() {
		if (confidenceLevel === null) {
			badgeColor = '';
			return;
		}

		if (confidenceLevel <= 50) {
			badgeColor = 'bg-red-500';
		} else if (confidenceLevel <= 70) {
			badgeColor = 'bg-blue-500';
		} else {
			badgeColor = 'bg-green-500';
		}
	}

	// Call this whenever confidenceLevel changes
	$effect(() => {
		calculateBadgeColor();
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-green-700">
		<Eye class="h-4 w-4" />
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Accomplishment Details</Dialog.Title>
			<Dialog.Description>
				Extra information about the indicator.
				<br />
				Operational Plan Indicator: {opIndicator.performance_indicator}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-6">
			<div>
				<h4 class="mb-2 font-medium">Accomplishment</h4>
				<div class="rounded-md border border-gray-200 p-3">
					{accomplishment.actual_accomplishments || 'No accomplishment provided'}
				</div>
				<p class="mt-1 text-sm text-gray-500">
					Description of what was accomplished for this indicator.
				</p>
			</div>

			<div>
				<h4 class="mb-2 font-medium">
					Quantity <span class="text-sm text-gray-600">({opIndicator.input_type})</span>
				</h4>
				<div class="rounded-md border border-gray-200 p-3">
					{accomplishment.quantity || 'No quantity provided'}
				</div>
				<p class="mt-1 text-sm text-gray-500">Quantitative measure of the accomplishment.</p>
			</div>

			<div>
				<h4 class="mb-2 font-medium">Accomplishment Date</h4>
				<div class="rounded-md border border-gray-200 p-3">
					{formattedDate || 'No date provided'}
				</div>
				<p class="mt-1 text-sm text-gray-500">The date when the indicator was accomplished.</p>
			</div>

			<div>
				<div class="flex h-fit items-center justify-center space-x-2">
					<h4 class="mb-2 font-medium">Evidence</h4>
					<h4 class="mb-2 font-medium">Confidence Level</h4>
					<Badge class={badgeColor}>{confidenceLevel}%</Badge>
				</div>
				{#if evidenceUrl}
					<div class="mt-2">
						<PdfViewer fileUrl={evidenceUrl} />
					</div>
					<p class="mt-1 text-sm text-gray-500">
						Supporting documentation for this accomplishment. Hover to show download button.
					</p>
				{:else}
					<div class="rounded-md border border-gray-200 p-3 text-gray-500">
						No evidence uploaded
					</div>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
