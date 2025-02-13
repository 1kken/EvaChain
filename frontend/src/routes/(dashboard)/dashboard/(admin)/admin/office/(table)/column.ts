import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteOffice, UpdateOffice } from '$lib/schemas/office/schema';
import type { Tables } from '$lib/types/database.types';

// This type is used to define the shape of our data.
export type Office = {
	id: number;
	code: string;
	name: string;
	unit: {
		id: number;
		code: string;
		name: string;
	} | null;
};

export const createColumns = (
	updateForm: SuperValidated<UpdateOffice>,
	deleteForm: SuperValidated<DeleteOffice>,
	units: Tables<'unit'>[]
): ColumnDef<Office>[] => [
	{
		accessorKey: 'code',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				arrangement: column.getIsSorted(),
				text: 'Acronym',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				arrangement: column.getIsSorted(),
				text: 'Office Name',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		id: 'unit',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				arrangement: column.getIsSorted(),
				text: 'Under Unit',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		accessorFn: (row) => row.unit?.name ?? 'No unit'
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const office = row.original;
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { deleteForm, updateForm, office, units });
		}
	}
];
