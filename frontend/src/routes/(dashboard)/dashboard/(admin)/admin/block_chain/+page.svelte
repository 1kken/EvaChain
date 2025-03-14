<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { DatabaseBackup } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import { createColumns } from './(table)/columns';
	import { LoaderCircle } from 'lucide-svelte';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	let isOpen = $state(false);
	let isLoading = $state(false);

	const blockChainData = $derived(data.blockChainData);
	const latestBlockChainData = $state(data.latestBlockChainData);
	const date = new Date(latestBlockChainData?.created_at ?? Date.now());
	const formattedDate = date.toLocaleDateString('en-GB');

	const backupData: SubmitFunction = ({ action }) => {
		isLoading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					showSuccessToast(result.data?.message ?? 'Backup Successfull!');
					break;
				case 'failure':
					showWarningToast(result?.data?.message + '\nBack up Successfull!' || 'Backup failed');
					break;
			}

			await invalidateAll();
			isOpen = false;
			isLoading = false;
		};
	};

	const columns = createColumns();
	let fileTypeOptions: PropOptionFacet[] = mapToOptions(
		[
			{ name: 'Data/CSV Type', value: 'DATA' },
			{ name: 'PDF/Evidence Type', value: 'FILE' }
		],
		'value', //value to search
		'name' //display
	);
	const propDataFacet: PropDataFacet[] = [{ column: 'fileType', options: fileTypeOptions }];
</script>

<DataTable
	filterDataFacet={propDataFacet}
	data={blockChainData}
	{columns}
	filterColumn={'fileName'}
	filterPlaceholder={'Search by File Name....'}
>
	<AlertDialog.Root bind:open={isOpen}>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'default' })}
			><DatabaseBackup size="16" />Backup Data</AlertDialog.Trigger
		>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>
					<span class="flex items-center gap-2">
						<TriangleAlert color="#fbbf24" />Are you absolutely sure?
					</span>
				</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently store data to the blockchain.
					<span class=" text-muted-foreground dar:text-white font-bold">
						This process wil take a few minutes.
					</span>
					last backup was done on
					<span class=" text-muted-foreground dar:text-white font-bold">
						{latestBlockChainData?.created_at ? formattedDate : 'Never'}
					</span>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<form action="?/backupdata" method="POST" id="backup-data" use:enhance={backupData}>
					<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
					<AlertDialog.Action type="submit" disabled={isLoading}>
						{#if isLoading}
							<LoaderCircle size="16" class="animate-spin" />
						{/if}
						{isLoading ? 'Backing up...' : 'Continue'}
					</AlertDialog.Action>
				</form>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</DataTable>
