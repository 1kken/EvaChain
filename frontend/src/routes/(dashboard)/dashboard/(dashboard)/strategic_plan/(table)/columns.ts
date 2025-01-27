import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DataLink from './dataLink.svelte';
import DateCell from './dateCell.svelte';
import type { Tables } from '$lib/types/database.types';
import type { SuperValidated } from 'sveltekit-superforms';
import type { UniversalDeleteInput } from '$lib/schemas/universal_delete_schema';
import type { UpdateStratPlanInput } from '../(data)/strat_plan_schema';
import TableActions from './tableActions.svelte';
// This type is used to define the shape of our data.
export type DPCR = Tables<'strategic_plan'>;

export const createColumns = (
	deleteForm: SuperValidated<UniversalDeleteInput>,
	updateForm: SuperValidated<UpdateStratPlanInput>
): ColumnDef<DPCR>[] => [
	{
		accessorKey: 'title',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Title',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			//display a link to the IPCR  wiht id
			const title = getValue<string>();
			const id = row.original.id;
			return renderComponent(DataLink, { id, name: title });
		}
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Created at',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue }) => {
			const dateValue = getValue<string>();
			return renderComponent(DateCell, { date: dateValue });
		}
	},
	{
		accessorKey: 'updated_at',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Updated at',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue }) => {
			const dateValue = getValue<string>();
			return renderComponent(DateCell, { date: dateValue });
		}
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const id = row.original.id;
			return renderComponent(TableActions, { deleteForm, updateForm, id });
		}
	}
];
