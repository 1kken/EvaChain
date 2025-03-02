<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { getAccomplishmentActivityIndicatorStore } from '../states/activity_indicator_state';
	import DetailsSection from './sub_components/view_indicator/DetailsSection.svelte';
	import IndicatorHeader from './sub_components/view_indicator/IndicatorHeader.svelte';
	import StatusSection from './sub_components/view_indicator/StatusSection.svelte';
	import TimestampSection from './sub_components/view_indicator/TimestampSection.svelte';

	let { indicator }: { indicator: Tables<'accomplishment_activity_indicator'> } = $props();
	const { currentAccomplishmentActivityIndicators } = getAccomplishmentActivityIndicatorStore();
	// const { currentAccomplishmentActivities } = getAccomplishmentindicatorStore();

	// Create reactive state using runes
	let currentindicator = $state(indicator);

	let progress = $state({
		q1: indicator.q1_accomplishment,
		q2: indicator.q2_accomplishment,
		q3: indicator.q3_accomplishment,
		q4: indicator.q4_accomplishment
	});

	let itemDetail = $state({
		responsible_officer_unit: indicator.responsible_officer_unit,
		accomplishmentRate: indicator.accomplishment_rate,
		remarks: indicator.remarks
	});

	let others = $state({
		accomplishment_rate: indicator.accomplishment_rate,
		annualTarget: indicator.annual_target,
		total: indicator.total
	});

	// Update state reactively when indicator changes
	$effect(() => {
		const updatedindicator = $currentAccomplishmentActivityIndicators.find(
			(accindicator) => accindicator.id === accindicator.id
		);

		if (updatedindicator) {
			currentindicator = updatedindicator;

			// Update progress state
			progress = {
				q1: indicator.q1_accomplishment,
				q2: indicator.q2_accomplishment,
				q3: indicator.q3_accomplishment,
				q4: indicator.q4_accomplishment
			};

			others = {
				accomplishment_rate: indicator.accomplishment_rate,
				annualTarget: indicator.annual_target,
				total: indicator.total
			};

			itemDetail = {
				responsible_officer_unit: indicator.responsible_officer_unit,
				accomplishmentRate: indicator.accomplishment_rate,
				remarks: indicator.remarks
			};
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full text-left focus-visible:outline-none">
		<TruncatedDiv text={indicator.performance_indicator} />
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<div class="mx-auto max-w-4xl space-y-8">
			<!-- Header Section -->
			<IndicatorHeader indicator={currentindicator.performance_indicator} />

			<!-- Status Section -->
			<StatusSection
				{progress}
				total={others.total}
				annualTarget={others.annualTarget}
				accomplishmentRate={others.accomplishment_rate ?? '0%'}
			/>

			<DetailsSection {itemDetail} />

			<!-- Timestamp Section -->
			<TimestampSection
				createdAt={currentindicator.created_at}
				updatedAt={currentindicator.updated_at}
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>
