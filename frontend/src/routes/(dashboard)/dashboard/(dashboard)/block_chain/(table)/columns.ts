import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DateCell from './dateCell.svelte';

// This type is used to define the shape of our data.
interface BlockChainData {
	file_cid: string;
	file_name: string;
	type: string;
	blockchain_hash: string;
	action: string;
	created_at: string; // or Date if you're parsing timestamps
}

export const createColumns = (): ColumnDef<BlockChainData>[] => [
	{
		accessorKey: 'file_name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'File Name',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			return getValue();
		}
	},
	{
		accessorKey: 'action',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Action',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'file_cid',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'File CID',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'type',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Data Type',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'blockchain_hash',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'BlockChain Tx Hash',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Created at',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue }) => {
			const dateValue = getValue<string>();
			return renderComponent(DateCell, { date: dateValue });
		}
	}
];
