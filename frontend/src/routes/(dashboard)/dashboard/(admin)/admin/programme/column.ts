import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet, type Component } from 'svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/university_management/data-table-sort-button.svelte';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteProgramme, UpdateProgramme } from '$lib/schemas/programme/schema';

// This type is used to define the shape of our data.
export type Programme = {
	id: number;
	name: string;
	unit: {
		id: number;
		code: string;
		name: string;
	} | null;
	office: {
		id: number;
		unit_id: number;
		code: string;
		name: string;
	} | null;
};
export const createColumns = (
	updateForm: SuperValidated<UpdateProgramme>,
	deleteForm: SuperValidated<DeleteProgramme>
): ColumnDef<Programme>[] => [
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
		id: 'name',
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Name',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		id: 'unit',
		accessorKey: 'unit',
		header: 'Under unit',
		accessorFn: (row) => {
			if (row.unit) {
				return `${row.unit.code}-${row.unit.name}`;
			}
			return 'No unit';
		}
	},
	{
		id: 'office',
		accessorKey: 'office',
		header: 'Under office',
		accessorFn: (row) => {
			if (row.office) {
				return `${row.office.code}-${row.office.name}`;
			}
			return 'No office';
		}
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
