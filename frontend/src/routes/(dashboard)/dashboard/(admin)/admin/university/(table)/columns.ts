import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteUnit, UpdateUnit } from '$lib/schemas/unit/schema';

// This type is used to define the shape of our data.
export type Unit = {
	code: string;
	created_at: string;
	id: number;
	name: string;
	updated_at: string;
};

export const createColumns = (
	deleteForm: SuperValidated<DeleteUnit>,
	updateForm: SuperValidated<UpdateUnit>
): ColumnDef<Unit>[] => [
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
				render: () => `<div class="text-left">Unit Name</div>`
			}));
			return renderSnippet(nameHeaderSnippet, '');
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const id = row.original.id;
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { deleteForm, updateForm, id });
		}
	}
];
