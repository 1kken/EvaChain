<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	interface Props {
		file?: File | null;
		fileUrl: string | null;
	}
	let { file, fileUrl }: Props = $props();

	// Function to fetch file from URL if provided
	async function fetchFileFromUrl() {
		if (!fileUrl) return null;

		try {
			const response = await fetch(fileUrl);
			const blob = await response.blob();
			const filename = fileUrl.split('?')[0].split('/').pop() || 'evidence.pdf';
			return new File([blob], filename, { type: 'application/pdf' });
		} catch (error) {
			console.error('Error fetching file:', error);
			return null;
		}
	}

	// Determine which source to use for the PDF
	let displayFile = $state<File | null>(null);
	let objectUrl = $state<string | null>(null);

	$effect(() => {
		if (file) {
			displayFile = file;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			objectUrl = URL.createObjectURL(file);
		} else if (fileUrl) {
			fetchFileFromUrl().then((fetchedFile) => {
				if (fetchedFile) {
					displayFile = fetchedFile;
					if (objectUrl) URL.revokeObjectURL(objectUrl);
					objectUrl = URL.createObjectURL(fetchedFile);
				}
			});
		}
	});

	// Clean up object URLs on component destruction
	onDestroy(() => {
		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
		}
	});

	function downloadFile() {
		if (!displayFile || !objectUrl) return;

		const a = document.createElement('a');
		a.href = objectUrl;
		a.download = displayFile.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

<div class="group relative h-[400px] w-full rounded-md border bg-gray-50">
	{#if displayFile && objectUrl}
		<!-- Download button -->
		<button
			aria-label="Download file"
			type="button"
			class="absolute right-2 top-2 z-10 rounded-full bg-green-800 p-1.5 text-white opacity-0 transition-colors duration-200 hover:bg-green-700 group-hover:opacity-100"
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				downloadFile();
			}}
			title="Download file"
		>
			<Download size={16} />
		</button>

		{#if displayFile.type.includes('image')}
			<img src={objectUrl} alt={displayFile.name} class="h-full w-full object-contain" />
		{:else if displayFile.type === 'application/pdf'}
			<object
				data={objectUrl}
				type="application/pdf"
				class="h-full w-full"
				aria-label={displayFile.name}
			></object>
		{:else}
			<div class="flex h-full w-full items-center justify-center text-gray-500">
				Unsupported file type: {displayFile.type}
			</div>
		{/if}
	{:else}
		<div class="flex h-full w-full items-center justify-center text-gray-500">
			{fileUrl ? 'Loading file...' : 'No file available'}
		</div>
	{/if}
</div>
