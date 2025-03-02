import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import type { Tables } from '$lib/types/database.types';
import UserDetails from './user-details.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { UpdateUserRoleSchemaInput } from '../utils/schema';
export const createColumns = (
	updateForm: SuperValidated<UpdateUserRoleSchemaInput>
): ColumnDef<Tables<'profile_details_view'>>[] => [
	{
		accessorKey: 'employee_id',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Name',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ row }) => {
			const userDetails = row.original;
			return renderComponent(UserDetails, { userDetails, updateForm });
		}
	}
];
