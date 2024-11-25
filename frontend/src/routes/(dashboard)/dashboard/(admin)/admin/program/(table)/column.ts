import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from './data-table-actions.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteProgram, UpdateProgram } from '$lib/schemas/program/schema';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';

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
	updateForm: SuperValidated<UpdateProgram>,
	deleteForm: SuperValidated<DeleteProgram>
): ColumnDef<Programme>[] => [
	{
		id: 'name',
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Name',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		id: 'unit',
		accessorKey: 'unit',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Under unit',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		accessorFn: (row) => {
			if (row.unit) {
				return `${row.unit.name}`;
			}
			return 'No unit';
		}
	},
	{
		id: 'office',
		accessorKey: 'office',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Under office',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		accessorFn: (row) => {
			if (row.office) {
				return `${row.office.name}`;
			}
			return 'No office';
		}
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const id = row.original.id;
			return renderComponent(DataTableActions, { id, deleteForm, updateForm });
		}
	}
];
