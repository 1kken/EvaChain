import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet, type Component } from 'svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteOffice, UpdateOffice } from '$lib/schemas/office/schema';

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

export const createColumns = <T extends Record<string, any>>(
	updateForm: SuperValidated<UpdateOffice>,
	deleteForm: SuperValidated<DeleteOffice>
): ColumnDef<Office>[] => [
	{
		accessorKey: 'code',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Code',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'name',
		header: () => {
			const nameHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left">Office Name</div>`
			}));
			return renderSnippet(nameHeaderSnippet, '');
		}
	},
	{
		id: 'unit',
		header: 'Under unit',
		accessorFn: (row) => row.unit?.code ?? 'No unit'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const id = row.original.id;
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { id, deleteForm, updateForm });
		}
	}
];
