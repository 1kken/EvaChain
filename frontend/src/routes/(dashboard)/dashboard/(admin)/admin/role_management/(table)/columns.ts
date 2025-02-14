import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from './actions.svelte';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { DeleteUnit, UpdateUnit } from '$lib/schemas/unit/schema';
import type { Tables } from '$lib/types/database.types';

export const createColumns = () // deleteForm: SuperValidated<DeleteUnit>,
// updateForm: SuperValidated<UpdateUnit>
: ColumnDef<Tables<'roles'>>[] => [
	{
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Name',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	}
	// {
	// 	id: 'actions',
	// 	header: 'Actions',
	// 	cell: ({ row }) => {
	// 		const unit = row.original;
	// 		// You can pass whatever you need from `row.original` to the component
	// 		return renderComponent(DataTableActions, { deleteForm, updateForm, unit });
	// 	}
	// }
];
