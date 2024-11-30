import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteUnit, UpdateUnit } from '$lib/schemas/unit/schema';
import { format } from 'date-fns';
import DateCell from './date-cell.svelte';

export type IPCR = {
	title: string;
	created_at: string;
	updated_at: string;
};

export const createColumns = () // deleteForm: SuperValidated<DeleteUnit>,
// updateForm: SuperValidated<UpdateUnit>
: ColumnDef<IPCR>[] => [
	{
		accessorKey: 'title',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Title',
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
			return format(new Date(dateValue), 'MM/dd/yyyy');
		}
	},
	{
		accessorKey: 'updated_at',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Updated at',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue }) => {
			const dateValue = getValue<string>();
			return renderComponent(DateCell, { date: dateValue });
		}
	}
	// {
	// 	id: 'actions',
	// 	header: 'Actions',
	// 	cell: ({ row }) => {
	// 		const id = row.original.id;
	// 		// You can pass whatever you need from `row.original` to the component
	// 		return renderComponent(DataTableActions, { deleteForm, updateForm, id });
	// 	}
	// }
];
