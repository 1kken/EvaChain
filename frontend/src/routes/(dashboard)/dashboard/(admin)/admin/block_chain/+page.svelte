<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
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

	let { data }: { data: PageData } = $props();

	let isOpen = $state(false);
	let isLoading = $state(false);

	const { blockChainData, latestBlockChainData } = data;

	const backupData: SubmitFunction = ({ action }) => {
		isLoading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					showSuccessToast('Backup successful');
					break;
				case 'error':
					showErrorToast('Backup failed');
					break;
				case 'failure':
					showErrorToast(result?.data?.error);
					break;
			}
			await update();
			isOpen = false;
			isLoading = false;
		};
	};

	const columns = createColumns();
	let fileTypeOptions: PropOptionFacet[] = mapToOptions(
		[
			{ name: 'Data/CSV Type', value: 1 },
			{ name: 'PDF/Evidence Type', value: 0 }
		],
		'value', //value to search
		'name' //display
	);
	const propDataFacet: PropDataFacet[] = [{ column: 'type', options: fileTypeOptions }];
</script>

<DataTable
	filterDataFacet={propDataFacet}
	data={blockChainData}
	{columns}
	filterColumn={'file_name'}
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
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<form action="?/backupdata" method="POST" id="backup-data" use:enhance={backupData}>
					<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
					<AlertDialog.Action type="submit" disabled={isLoading}>
						{#if isLoading}
							<LoaderCircle size="16" />
						{/if}
						{isLoading ? 'Backing up...' : 'Continue'}
					</AlertDialog.Action>
				</form>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</DataTable>
