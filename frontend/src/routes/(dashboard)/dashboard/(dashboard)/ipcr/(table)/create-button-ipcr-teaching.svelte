<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createIPCRSchema } from '../(data)/schema';
	import { getAuthStore } from '$lib/utils/authStore';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import type { IPCRFormResult } from '../(data)/types';
	import { getIPCRStore } from '../(data)/state.svelte';
	import IncompleteProfileDialog from './incomplete-profile-dialog.svelte';

	let { data } = $props();
	const { currentProfile } = getAuthStore();
	const ipcrStore = getIPCRStore();
	const form = superForm(data, {
		validators: zodClient(createIPCRSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRFormResult>;
			if (form.valid && action && ipcrStore) {
				const ipcrData = action.ipcrData;
				ipcrStore.addIPCR(ipcrData);
				showSuccessToast(`Succesfully added IPCR ${ipcrData.title}`);
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
	let completeProfile = $state(true);
	let errorMessage = $state<string | null>();
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
		if ($currentProfile?.id) {
			$formData.owner_id = $currentProfile.id;
		}
		if ($message?.status === 'success') {
			showSuccessToast($message.text);
		}
	});
</script>

<form action="?/createipcr" method="POST" use:enhance>
	<input type="hidden" name="owner_id" bind:value={$formData.owner_id} />
	{#if $delayed || $currentProfile === null}
		<Button disabled><LoaderCircle class="animate-spin" />Processing...</Button>
	{:else if !completeProfile}
		<IncompleteProfileDialog errors={errorMessage} />
	{:else}
		<Button type="submit"><Plus />Create IPCR</Button>
	{/if}
</form>
