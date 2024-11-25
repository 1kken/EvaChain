<script lang="ts" generics="TData">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { Table } from '@tanstack/table-core';

	interface Props<TData> {
		table: Table<TData>;
	}

	let { table }: Props<TData> = $props();
</script>

<div class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
	<div class="text-muted-foreground hidden text-sm sm:block">
		<p>
			Showing <span class="font-medium">{table.getRowModel().rows.length}</span> of{' '}
			<span class="font-medium">{table.getCoreRowModel().rows.length}</span> results
		</p>
	</div>

	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
		<div class="flex items-center gap-2">
			<Label class="text-muted-foreground whitespace-nowrap text-sm">Rows per page:</Label>
			<Input
				type="number"
				value={table.getState().pagination.pageSize}
				oninput={(e) => {
					const newSize = parseInt(e.currentTarget.value);
					if (newSize >= 1 && newSize <= 100) {
						table.setPageSize(newSize);
					}
				}}
				class="h-8 w-16 text-sm"
				min="1"
				max="100"
			/>
		</div>

		<div class="flex items-center justify-between gap-2 sm:justify-start">
			<div class="flex gap-1">
				<Button
					variant="outline"
					size="sm"
					class="h-8 w-8 p-0"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to first page</span>
					<ChevronFirst class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					class="h-8 w-8 p-0"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to previous page</span>
					<ChevronLeft class="h-4 w-4" />
				</Button>
			</div>

			<div class="flex min-w-[100px] items-center justify-center text-sm font-medium">
				<span class="hidden sm:block">Page</span>
				<span class="px-1">{table.getState().pagination.pageIndex + 1}</span>
				<span class="hidden sm:block">of</span>
				<span class="sm:px-1">/</span>
				<span>{table.getPageCount()}</span>
			</div>

			<div class="flex gap-1">
				<Button
					variant="outline"
					size="sm"
					class="h-8 w-8 p-0"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to next page</span>
					<ChevronRight class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					class="h-8 w-8 p-0"
					onclick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to last page</span>
					<ChevronLast class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
</div>
