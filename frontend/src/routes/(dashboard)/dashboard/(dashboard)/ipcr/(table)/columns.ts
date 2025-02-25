import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DateCell from './date-cell.svelte';
import DataTableActions from './data-table-actions.svelte';
// import type { DeleteIPCRSchema } from '../(data)/schema';
import type { SuperValidated } from 'sveltekit-superforms';
import type { Tables } from '$lib/types/database.types';
import type { DeleteIPCRSchema, UpdateIPCRSchema } from '../(data)/schema';
import DataLink from './data-link.svelte';

export type IPCR = Tables<'ipcr'>;

export const createColumns = (
	deleteForm: SuperValidated<DeleteIPCRSchema>,
	updateForm: SuperValidated<UpdateIPCRSchema>
): ColumnDef<IPCR>[] => [
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
		accessorKey: 'status',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'IPCR status',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue }) => {
			const status = getValue<string>();
			const displayStatus =
				{
					draft: 'Draft',
					submitted_raw: 'Submitted (Raw w/o Accomplishment and Self-Rating)',
					under_review_raw: 'Under Review',
					revision_raw: 'For Revision (Raw w/o Accomplishment and Self-Rating)',
					reviewed_raw: 'Reviewed (Can upload accomplishments) w/ Self-Rating',
					submitted: 'Submitted (w/ Self-Rating)',
					under_review: 'Under Review (w/ Self-Rating)',
					revision: 'For Revision (w/ Self-Rating)',
					approved: 'Approved'
				}[status] || 'Unknown State';
			return displayStatus;
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
			const ipcr = row.original;
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { deleteForm, updateForm, ipcr });
		}
	}
];
