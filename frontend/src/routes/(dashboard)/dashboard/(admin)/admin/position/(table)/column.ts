import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from './data-table-actions.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteProgram, UpdateProgram } from '$lib/schemas/program/schema';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';

// This type is used to define the shape of our data.
export type Position = {
	id: number;
	name: string;
	nature_of_work: {
		id: number;
		type: string;
	} | null;
};
export const createColumns = (
	updateForm: SuperValidated<UpdateProgram>,
	deleteForm: SuperValidated<DeleteProgram>
): ColumnDef<Position>[] => [
	{
		id: 'type',
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Position Title',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		id: 'nature_of_work',
		accessorKey: 'nature_of_work',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Under Nature of work',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		accessorFn: (row) => {
			if (row.nature_of_work) {
				return `${row.nature_of_work.type}`;
			}
			return 'No nature of work';
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
