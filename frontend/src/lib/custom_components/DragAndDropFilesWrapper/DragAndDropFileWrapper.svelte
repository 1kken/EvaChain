<script lang="ts">
	import { cn } from '$lib/utils';
	import { CircleX, Download } from 'lucide-svelte';
	import { createFileHandlers } from './helper';

	type Props = {
		role?: string;
		text: string;
		maxFiles?: number;
		acceptedFileTypes?: string[];
		maxSize?: number;
		className?: string;
		id?: string;
		name: string;
		onFileSelect: (files: File[]) => void;
	};

	let {
		role = 'button',
		text,
		maxFiles = 1,
		acceptedFileTypes = ['*/*'],
		maxSize = 45000000,
		className = '',
		id = 'file-drop-zone',
		name,
		onFileSelect
	}: Props = $props();

	let isDropZoneActive = $state(false);
	let error = $state<string | null>(null);
	let files = $state<File[]>([]); // Initialize as empty array instead of null
	let fileInput: HTMLInputElement;

	const { handleDrop, handleDragOver, handleDragEnter, handleDragLeave, handleFileSelect } =
		createFileHandlers({
			maxFiles,
			acceptedFileTypes,
			maxSize,
			onError: (errorMessage) => {
				error = errorMessage;
				setTimeout(() => (error = null), 3000);
			},
			onValidFiles: (validFiles) => {
				files = validFiles; // Update the files state
				onFileSelect(validFiles);
			}
		});

	// Clean up object URLs when files change
	$effect(() => {
		return () => {
			files.forEach((file) => {
				if ('objectURL' in file) {
					URL.revokeObjectURL((file as any).objectURL);
				}
			});
		};
	});

	function handleClick() {
		fileInput.click();
	}

	function onDragEnter(e: DragEvent) {
		handleDragEnter(e);
		isDropZoneActive = true;
	}

	function onDragLeave(e: DragEvent) {
		handleDragLeave(e);
		isDropZoneActive = false;
	}

	function onDrop(e: DragEvent) {
		handleDrop(e);
		isDropZoneActive = false;
	}
</script>

<div class="relative">
	<input
		bind:this={fileInput}
		type="file"
		accept={acceptedFileTypes.join(',')}
		multiple={maxFiles > 1}
		class="hidden"
		onchange={handleFileSelect}
	/>
	<div
		{id}
		{role}
		class={cn(
			'flex min-h-40 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition-colors duration-200',
			{
				'border-green-500 bg-green-50': isDropZoneActive,
				'border-red-500 bg-red-50': error
			},
			className
		)}
		onclick={handleClick}
		ondrop={onDrop}
		ondragover={handleDragOver}
		ondragenter={onDragEnter}
		ondragleave={onDragLeave}
	>
		{#if files.length === 0}
			{text}
		{:else}
			<div class="grid w-full grid-cols-1 gap-4 p-4">
				{#each files as file (file.name)}
					{@render showPreview(file)}
				{/each}
			</div>
		{/if}
	</div>
	{#if error}
		<div class="absolute -bottom-6 left-0 text-sm text-red-500">
			{error}
		</div>
	{/if}
</div>

{#snippet showPreview(file: File)}
	<div class="group relative h-40 w-full overflow-hidden rounded border">
		<!-- Delete button -->
		<button
			aria-label="Remove file"
			type="button"
			class="absolute right-2 top-2 z-10 rounded-full bg-red-600 p-1 text-white opacity-0 transition-colors hover:bg-red-500 group-hover:opacity-100"
			onclick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				files = files.filter((f) => f !== file);
				onFileSelect(files);
			}}
			title="Remove file"
		>
			<CircleX size={16} />
		</button>

		<!-- Download button -->
		<button
			aria-label="Download file"
			type="button"
			class="absolute right-2 top-10 z-10 rounded-full bg-green-800 p-1 text-white opacity-0 transition-colors duration-200 hover:bg-green-700 group-hover:opacity-100"
			onclick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				const url = URL.createObjectURL(file);
				const a = document.createElement('a');
				a.href = url;
				a.download = file.name;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}}
			title="Download file"
		>
			<Download size={16} />
		</button>

		{#if file.type.includes('image')}
			<img src={URL.createObjectURL(file)} alt={file.name} class="h-full w-full object-contain" />
		{:else if file.type === 'application/pdf'}
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<object
				data={URL.createObjectURL(file)}
				type="application/pdf"
				class="h-full w-full"
				aria-label={file.name}
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<span class="text-gray-500">Unsupported file type</span>
			</div>
		{/if}
	</div>
{/snippet}
