<script lang="ts">
	import { getHeadsChartStore } from '$lib/charts/head_of_op-vice_president/state';
	import * as Select from '$lib/components/ui/select/index.js';

	let { academicOffices, currentAcademicIpcrAnalysis } = getHeadsChartStore();

	let selection = $academicOffices || [];
	let value = $state($currentAcademicIpcrAnalysis);

	const triggerContent = $derived(
		value === ''
			? 'All'
			: (selection.find((f) => f.id.toString() === value)?.code ?? 'Select Office')
	);
</script>

<Select.Root
	type="single"
	name="academic-office"
	onValueChange={($event) => {
		value = $event;
		currentAcademicIpcrAnalysis.set(value);
	}}
>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.GroupHeading>Academic Offices</Select.GroupHeading>
			<Select.Item value="" label="All">All</Select.Item>
			{#each selection as office}
				<Select.Item value={office.id.toString()} label={office.code}>{office.code}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
