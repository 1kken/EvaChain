<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type VisibilityState,
		type RowSelectionState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		getFacetedRowModel,
		getFacetedMinMaxValues,
		getFacetedUniqueValues
	} from '@tanstack/table-core';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Filter } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { type Snippet } from 'svelte';
	import { Search, ListFilter, X } from 'lucide-svelte';
	import DataTableFacet from './data-table-facet.svelte';
	import type { PropDataFacet } from './helper';
	import { Label } from '$lib/components/ui/label';
	import DataTableFooter from './data-table-footer.svelte';

	interface Props<TData, TValue> {
		data: TData[];
		columns: ColumnDef<TData, TValue>[];
		filterDataFacet?: PropDataFacet[];
		filterColumn?: string;
		enablePagination?: boolean;
		enableColumnVisibility?: boolean;
		enableFiltering?: boolean;
		pageSize?: number;
		filterPlaceholder: string;
		children?: Snippet;
	}

	let {
		filterPlaceholder = 'Search..',
		data,
		columns,
		filterColumn = 'name',
		enablePagination = true,
		enableColumnVisibility = true,
		enableFiltering = true,
		pageSize = 10,
		filterDataFacet,
		children
	}: Props<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	let showMobileSearch = $state(false);
	let showMobileFilter = $state(false);
	function toggleMobileSearch() {
		showMobileSearch = !showMobileSearch;
	}

	function toggleMobileFilter() {
		showMobileFilter = !showMobileFilter;
	}
</script>

<div>
	<div class="flex items-center gap-3 py-4">
		{@render children?.()}
		<div class="hidden w-full items-center gap-3 md:flex">
			{#if filterDataFacet}
				{#each filterDataFacet as filter, i (i)}
					<DataTableFacet
						column={table.getColumn(filter.column)}
						title={filter.column}
						options={filter.options}
					/>
				{/each}
			{/if}
			{#if enableFiltering}
				<Input
					placeholder={filterPlaceholder}
					value={table.getColumn(filterColumn)?.getFilterValue() as string}
					onchange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
					oninput={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
					class="max-w-sm"
				/>
			{/if}

			{#if enableColumnVisibility}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="ml-auto">
								Columns <ChevronDown />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
							<DropdownMenu.CheckboxItem
								class="capitalize"
								controlledChecked
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{column.id}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>

		<!-- Mobile View -->
		<div class="item-end flex w-full gap-2 md:hidden">
			{#if showMobileSearch}
				<div class="flex w-full items-center gap-2">
					<Input
						placeholder={filterPlaceholder}
						value={table.getColumn(filterColumn)?.getFilterValue() as string}
						onchange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
						oninput={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
						class="w-full"
					/>
					<Button variant="ghost" size="icon" onclick={toggleMobileSearch}>
						<X class="h-4 w-4" />
					</Button>
				</div>
			{:else if showMobileFilter}
				<div class="flex w-full items-center justify-items-start gap-2">
					{#if filterDataFacet}
						{#each filterDataFacet as filter, i (i)}
							<DataTableFacet
								column={table.getColumn(filter.column)}
								title={filter.column}
								options={filter.options}
							/>
						{/each}
					{/if}
				</div>
				<Button variant="ghost" size="icon" onclick={toggleMobileFilter}>
					<X class="h-4 w-4" />
				</Button>
			{:else}
				<div class="flex w-full items-center justify-between">
					<div class="flex">
						<div>
							<Button variant="ghost" size="icon" onclick={toggleMobileSearch}>
								<Search class="h-4 w-4" />
							</Button>
						</div>
					</div>
					<div class="flex items-center gap-2">
						{#if filterDataFacet}
							<div>
								<Button variant="ghost" size="icon" onclick={toggleMobileFilter}>
									<Filter class="h-4 w-4" />
								</Button>
							</div>
						{/if}
						{#if enableColumnVisibility}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="ghost" size="icon">
											<ListFilter class="h-4 w-4" />
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									{#each table
										.getAllColumns()
										.filter((col) => col.getCanHide()) as column (column.id)}
										<DropdownMenu.CheckboxItem
											class="capitalize"
											controlledChecked
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenu.CheckboxItem>
									{/each}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	{#if enablePagination}
		<DataTableFooter {table} />
	{/if}
</div>
