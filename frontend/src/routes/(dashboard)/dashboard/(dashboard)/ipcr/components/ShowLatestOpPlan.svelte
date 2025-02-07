<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getAuthStore } from '$lib/utils/authStore';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import { SquareArrowOutUpRight } from 'lucide-svelte';
	import IncompleteProfileDialog from '../(table)/incomplete-profile-dialog.svelte';

	interface Props {
		id: string | null;
	}

	let { id }: Props = $props();

	//if incomplete profile
	let completeProfile = $state(true);
	let errorMessage = $state<string | null>();
	const { currentProfile } = getAuthStore();

	$effect(() => {
		if ($currentProfile === null) return;
		const errormessage = checkProfileCompletion($currentProfile);
		if (errormessage) {
			completeProfile = false;
			errorMessage = errormessage;
		} else {
			completeProfile = true;
			errorMessage = null;
		}
	});

	//for showing the latest operational plan
	const viewPdf = async (id: string) => {
		try {
			const response = await fetch(`/api/operational_plan/pdfDownload?id=${id}&inline=true`, {
				method: 'POST'
			});
			if (!response.ok) throw new Error('Failed to generate PDF');

			// Create blob URL and open in new tab
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');

			// Clean up blob URL after opening
			setTimeout(() => URL.revokeObjectURL(url), 100);
		} catch (error) {
			console.error('Error viewing PDF:', error);
			// Handle error appropriately
		}
	};
</script>

{#if completeProfile && id}
	<Button onclick={() => viewPdf(id)}>
		<SquareArrowOutUpRight />
		Show Latest Operational Plan</Button
	>
{:else}
	<IncompleteProfileDialog errors={errorMessage} />
{/if}
