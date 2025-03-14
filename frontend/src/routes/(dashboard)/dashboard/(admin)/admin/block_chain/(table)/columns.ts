import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DataLink from './dataLink.svelte';
import type { FileActionEvent } from '../block_chain_helper';
import EtherscanLink from './etherscanLink.svelte';

export const createColumns = (): ColumnDef<FileActionEvent>[] => [
	{
		accessorKey: 'fileName',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'File Name',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			const title = getValue<string>();
			const cid = row.original.cid;
			return renderComponent(DataLink, { cid, name: title });
		}
	},
	{
		accessorKey: 'action',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Action',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			const action = getValue<string>();
			return action.split('_').join(' ');
		}
	},
	{
		accessorKey: 'fileType',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Data Type',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			const type = getValue<string>();
			return type;
		}
	},
	{
		accessorKey: 'transactionHash',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Transaction Hash',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			const transactionHash = getValue<string>();
			return renderComponent(EtherscanLink, { transactionHash: transactionHash });
		}
	}
];
