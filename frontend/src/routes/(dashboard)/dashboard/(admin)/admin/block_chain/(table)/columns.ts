import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DataLink from './dataLink.svelte';
import DateCell from './dateCell.svelte';
import type { Tables } from '$lib/types/database.types';
// This type is used to define the shape of our data.
export type BlockChainData = Tables<'blockchain_data'>;

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
			//display a link to the IPCR  wiht id
			const title = getValue<string>();
			const id = row.original.id;
			return renderComponent(DataLink, { id, name: title });
		}
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
