import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type {
	DeleteEmployeeStatus,
	UpdateEmployeeStatus
} from '$lib/schemas/employeestatus/schema';
import type { Tables } from '$lib/types/database.types';

// This type is used to define the shape of our data.

export const createColumns = (
	updateForm: SuperValidated<UpdateEmployeeStatus>,
	deleteForm: SuperValidated<DeleteEmployeeStatus>
): ColumnDef<Tables<'employee_status'>>[] => [
	{
		accessorKey: 'type',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				arrangement: column.getIsSorted(),
				text: 'Type',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const employeeStatus = row.original;
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { employeeStatus, deleteForm, updateForm });
		}
	}
];
