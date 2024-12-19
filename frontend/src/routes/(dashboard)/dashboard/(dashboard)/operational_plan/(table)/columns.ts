import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DateCell from './date-cell.svelte';
import type { UniversalDeleteInput } from '$lib/schemas/universal_delete_schema';
import type { UpdateOperationalPlanInput } from '../(data)/operational_plan_schema';
import type { SuperValidated } from 'sveltekit-superforms';
import DataLink from './data-link.svelte';
// This type is used to define the shape of our data.
export type OperationalPlan = {
	id: string;
	title: string;
	implementing_unit: string;
	created_at: string;
};

export const createColumns = (
	deleteForm: SuperValidated<UniversalDeleteInput>,
	updateForm: SuperValidated<UpdateOperationalPlanInput>
): ColumnDef<OperationalPlan>[] => [
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
		accessorKey: 'implementing_unit',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Implementing Unit',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
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
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { deleteForm, updateForm, id });
		}
	}
];
