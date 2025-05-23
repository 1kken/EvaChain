import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DateCell from './Date.svelte';
import DataLink from './Link.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { UniversalDeleteInput } from '$lib/schemas/universal_delete_schema';
import type { UpdateAccomplishmentReportInput } from '../(data)/accomp_schema';
import Actions from './Actions.svelte';
// This type is used to define the shape of our data.
export type Accomplishment = {
	id: string;
	title: string;
	implementing_unit: string;
	created_at: string;
};

export const createColumns = (
	deleteForm: SuperValidated<UniversalDeleteInput>,
	updateForm: SuperValidated<UpdateAccomplishmentReportInput>
): ColumnDef<Accomplishment>[] => [
	{
		accessorKey: 'title',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Title',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
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
			return renderComponent(Actions, { deleteForm, updateForm, id });
		}
	}
];
