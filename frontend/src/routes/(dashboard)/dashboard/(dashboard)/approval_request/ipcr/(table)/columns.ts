import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
import DateCell from './date-cell.svelte';
import DataLink from './data-link.svelte';
import type { Tables } from '$lib/types/database.types';
import { titleCase } from 'title-case';
import type { SuperValidated } from 'sveltekit-superforms';
import type { RevisionSchemaInput, UuidSchemaInput } from '../(data)/zod_schema';
import DataTableActions from './data-table-actions.svelte';

export const createColumns = (
	uuidForm: SuperValidated<UuidSchemaInput>,
	revisionForm: SuperValidated<RevisionSchemaInput>
): ColumnDef<Tables<'ipcr_supervisor_details_view'>>[] => [
	{
		accessorKey: 'ipcr_title',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'IPCR Title',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			//display a link to the IPCR  wiht id
			const title = getValue<string>();
			const id = row.original.ipcr_id!; // Its impossible to have a ciew where ipcr id null
			return renderComponent(DataLink, { id, name: title });
		}
	},
	{
		accessorKey: 'owner_full_name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'IPCR Owner Name.',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue }) => {
			const name = getValue<string>();
			return titleCase(name);
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
					under_review_raw: 'Under Review',
					revision_raw: 'For Revision (Raw w/o Accomplishment and Self-Rating)',
					reviewed_raw: 'Reviewed (Can upload accomplishments) w/ Self-Rating',
					under_review: 'Under Review (w/ Self-Rating)',
					revision: 'For Revision (w/ Self-Rating)',
					approved: 'Approved'
				}[status] || 'Pending Action';
			return displayStatus;
		}
	},
	{
		accessorKey: 'supervisor_assignment_date',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Assignment Date.',
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
			const ipcr_details = row.original;
			return renderComponent(DataTableActions, { ipcr_details, uuidForm, revisionForm });
		}
	}
];
