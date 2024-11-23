import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from '$lib/custom_components/university_management/data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/university_management/data-table-sort-button.svelte';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
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

export const createColumns = (
	updateForm: SuperValidated<UpdateOffice>,
	deleteForm: SuperValidated<DeleteOffice>
): ColumnDef<Office>[] => [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				controlledChecked: true,
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				controlledChecked: true,
				'aria-label': 'Select row'
			}),
		enableSorting: true,
		enableHiding: false
	},
	{
		accessorKey: 'code',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
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
			return renderComponent(DataTableActions, { id });
		}
	}
];
