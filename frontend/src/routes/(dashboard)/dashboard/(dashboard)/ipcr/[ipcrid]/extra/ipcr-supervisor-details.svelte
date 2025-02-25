<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { cn } from '$lib/utils';
	import { ChevronRight } from 'lucide-svelte';
	import { Spring } from 'svelte/motion';

	type SupervisorStatus =
		| 'under_review_raw'
		| 'revision_raw'
		| 'reviewed_raw'
		| 'under_review'
		| 'revision'
		| 'approved';
	type SupervisorDetails = Tables<'ipcr_supervisor_details_view'>;

	interface Props {
		supervisors: SupervisorDetails[];
		title: string;
	}

	let props: Props = $props();

	let isExpanded = $state(false);

	// Map status to friendly display names
	const statusLabels: Record<SupervisorStatus, string> = {
		under_review_raw: 'Reviewing',
		revision_raw: 'Needs Revision',
		reviewed_raw: 'Reviewed',
		under_review: 'Reviewing',
		revision: 'Needs Revision',
		approved: 'Approved'
	};

	// Map status to colors
	const statusColors: Record<SupervisorStatus, string> = {
		under_review_raw: 'bg-blue-500',
		revision_raw: 'bg-orange-500',
		reviewed_raw: 'bg-green-500',
		under_review: 'bg-blue-500',
		revision: 'bg-orange-500',
		approved: 'bg-green-500'
	};

	function getStatusColor(status: SupervisorStatus | null): string {
		if (!status) return 'bg-gray-300';
		return statusColors[status] || 'bg-gray-300';
	}

	function getStatusLabel(status: SupervisorStatus | null): string {
		if (!status) return 'Pending';
		return statusLabels[status] || 'Unknown';
	}

	// Animation for rotation
	const rotateSpring = new Spring(0);
	$effect(() => {
		rotateSpring.set(isExpanded ? 90 : 0);
	});
</script>

<div
	role="region"
	aria-labelledby="supervisor-details-title"
	class={cn(
		'relative w-64 overflow-hidden rounded-md border transition-all duration-300 ease-in-out',
		'border-border bg-card dark:border-border/80 shadow-sm hover:shadow-md'
	)}
	style:max-height={isExpanded ? '200px' : '40px'}
	onmouseenter={() => (isExpanded = true)}
	onmouseleave={() => (isExpanded = false)}
>
	<div class="flex items-center justify-between p-2">
		<span id="supervisor-details-title" class="text-foreground font-semibold">{props.title}</span>
		<ChevronRight
			class={cn(
				'text-muted-foreground h-6 w-6 transition-transform duration-300',
				isExpanded && 'rotate-90'
			)}
		/>
	</div>

	<div class="overflow-y-auto" style:max-height="160px">
		{#each props.supervisors as supervisor}
			<div class="border-border/40 flex items-center justify-between border-t p-2">
				<div class="flex items-center space-x-2">
					<div
						class={`h-3 w-3 rounded-full ${getStatusColor(supervisor.supervisor_review_status)}`}
					></div>
					<span class="text-foreground truncate text-sm">{supervisor.supervisor_full_name}</span>
				</div>
				<span class="text-muted-foreground text-sm font-medium capitalize">
					{getStatusLabel(supervisor.supervisor_review_status)}
				</span>
			</div>
		{:else}
			<div class="p-2 border-t border-border/40 text-center text-sm text-muted-foreground">
				No supervisors assigned
			</div>
		{/each}
	</div>
</div>
