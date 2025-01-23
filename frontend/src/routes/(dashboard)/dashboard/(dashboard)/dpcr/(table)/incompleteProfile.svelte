<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { OctagonAlert } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { getAuthStore } from '$lib/utils/authStore';

	const { errors } = $props<string>();
	const { currentProfile } = getAuthStore();

	function handleContinue() {
		if ($currentProfile?.id) {
			goto(`/dashboard/profile/view/${$currentProfile.id}`);
		}
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'outline' }) + ' bg-yellow-500'}>
		<span class="flex items-center gap-2 text-sm">
			<OctagonAlert size={18} />Incomplete Profile Details
		</span>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center gap-2">
				<OctagonAlert color="#FFB449" />Incomplete Profile Details
			</AlertDialog.Title>
			<AlertDialog.Description>
				{errors} Click continue to go on profile page!
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleContinue}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
