import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableSortButton from '$lib/custom_components/data-table/data-table-sort-button.svelte';
// import type { DeleteIPCRSchema } from '../(data)/schema';
import type { Tables } from '$lib/types/database.types';
import { titleCase } from 'title-case';
import DataLink from './data-link.svelte';
import { getUserAuthStore } from '$lib/utils/rbac';

const { hasRole } = getUserAuthStore();
const isHeadOfUnit = hasRole('head_of_operating_unit');

export type IPCR = Tables<'ipcr_owner_details'>;

export const createColumns = (): ColumnDef<IPCR>[] => [
	{
		accessorKey: 'full_name',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Full Name',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			//display a link to the IPCR  wiht id
			const name = getValue<string>();
			return titleCase(name);
		}
	},
	{
		accessorKey: 'employee_id',
		header: ({ column }) =>
			renderComponent(DataTableSortButton, {
				text: 'Employee ID',
				arrangement: column.getIsSorted(),
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			}),
		cell: ({ getValue, row }) => {
			//display a link to the IPCR  wiht id
			const employeeId = getValue<string>();
			return employeeId;
		}
	},
	{
		accessorKey: 'ipcr_status',
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
					submitted_raw: 'Submitted',
					under_review_raw: 'Under Review',
					revision_raw: 'For Revision (Without Accomplishment and Self-Rating)',
					reviewed_raw: 'Reviewed (Can upload accomplishments w/ Self-Rating)',
					submitted: 'Submitted (With Self-Rating)',
					under_review: 'Under Review (With Self-Rating)',
					revision: 'For Revision (With Self-Rating)',
					approved: 'Approved'
				}[status] || 'Unknown State';
			return displayStatus;
		}
	},
	{
		accessorKey: 'title',
		header: ({ column }) => 'File',
		cell: ({ getValue, row }) => {
			//display a link to the IPCR  wiht id
			const id = row.original.ipcr_id!;
			return renderComponent(DataLink, { id });
		}
	}
];
