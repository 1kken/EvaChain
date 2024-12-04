<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import Button from '$lib/components/ui/button/button.svelte';
	import AvatarButton from './avatar-button.svelte';
	import { cn } from '$lib/utils';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Image } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { Upload } from 'lucide-svelte';
	import { X } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { getAuthStore } from '$lib/utils/authStore';

	type AcceptedFileTypes = 'image/jpeg' | 'image/png' | 'image/jpg';
	const ACCEPTED_FILE_TYPES: AcceptedFileTypes[] = ['image/jpeg', 'image/png', 'image/jpg'];
	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

	let dragActive = $state(false);
	let file = $state<File | null>(null);
	let error = $state<string>('');
	let previewUrl = $state<string>('');
	let form: HTMLFormElement;

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = false;

		if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
			handleFiles(e.dataTransfer.files);
		}
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			handleFiles(target.files);
		}
	}

	function handleFiles(files: FileList) {
		const selectedFile = files[0];

		if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type as AcceptedFileTypes)) {
			error = 'Please upload a JPG, JPEG, or PNG file.';
			clearFile();
			return;
		}

		if (selectedFile.size > MAX_FILE_SIZE) {
			error = 'File size must be less than 10MB.';
			clearFile();
			return;
		}

		file = selectedFile;
		error = '';

		// Create preview URL
		const reader = new FileReader();
		reader.onload = (e) => {
			previewUrl = e.target?.result as string;
		};
		reader.readAsDataURL(selectedFile);
	}

	function clearFile() {
		file = null;
		previewUrl = '';
		// Reset the file input value if it exists
		const fileInput = document.getElementById('image-upload') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	// Cleanup preview URL on component unmount
	onDestroy(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
	});

	let isOpen = $state(false);
	let uploading = $state(false);
	const { currentProfile } = getAuthStore();
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none"><AvatarButton /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<div class="mx-auto w-full max-w-md">
				<form
					bind:this={form}
					method="POST"
					enctype="multipart/form-data"
					action="?/uploadImage"
					use:enhance={({ formData }) => {
						uploading = true;
						if (file) {
							formData.set('image', file);
						}
						return async ({ result }) => {
							if (result.type === 'success') {
								clearFile();
								uploading = false;
								showSuccessToast('Image Upload Successfull');
								isOpen = false;
								if ($currentProfile) {
									$currentProfile.avatar_url = result.data?.publicUrl as string;
								}
							}
							if (result.type === 'failure') {
								uploading = false;
								showErrorToast('Cannot upload image please try again');
								isOpen = false;
							}
							if (result.type === 'error') {
								uploading = false;
								showErrorToast('Something went wrong, try again later...');
								isOpen = false;
							}
						};
					}}
				>
					<Label for="image-upload" class="mb-2 block text-sm font-medium text-gray-700"
						>Upload Image</Label
					>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class={cn(
							'mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5',
							dragActive && 'border-primary',
							'relative'
						)}
						ondragenter={handleDragEnter}
						ondragleave={handleDragLeave}
						ondragover={handleDragOver}
						ondrop={handleDrop}
					>
						<div class="space-y-1 text-center">
							{#if previewUrl}
								<div class="relative inline-block">
									<img
										src={previewUrl}
										alt="Preview"
										class="mx-auto h-32 w-32 rounded-full object-cover"
									/>
									<button
										type="button"
										class="absolute -right-2 -top-2 rounded-full bg-gray-100 p-1 transition-colors hover:bg-gray-200"
										onclick={clearFile}
										aria-label="Remove image"
									>
										<X class="h-4 w-4 text-gray-500" />
									</button>
								</div>
							{:else}
								<Upload class="mx-auto h-12 w-12 text-gray-400" />
								<div class="flex text-sm text-gray-600">
									<label
										for="image-upload"
										class="text-primary hover:text-primary-dark focus-within:ring-primary relative cursor-pointer rounded-md bg-white font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
									>
										<span>Upload a file</span>
										<Input
											id="image-upload"
											name="image"
											type="file"
											class="sr-only"
											accept="image/jpeg,image/png,image/jpg"
											onchange={handleChange}
										/>
									</label>
									<p class="pl-1">or drag and drop</p>
								</div>
							{/if}
							<p class="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
						</div>
					</div>

					{#if file}
						<div class="mt-4">
							<p class="text-sm text-gray-500">Selected file: {file.name}</p>
							<p class="text-xs text-gray-400">Size: {(file.size / 1024 / 1024).toFixed(2)}MB</p>
						</div>
					{/if}

					{#if uploading}
						<Button type="submit" class="mt-4 w-full" disabled>
							<LoaderCircle class="animate-spin" />
							<Image class="mr-2 h-4 w-4" />
							Uploading ...
						</Button>
					{:else}
						<Button type="submit" class="mt-4 w-full" disabled={!file}>
							<Image class="mr-2 h-4 w-4" />
							Upload Image
						</Button>
					{/if}
				</form>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
