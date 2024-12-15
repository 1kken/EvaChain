// src/lib/utils/file-handlers.ts
export type FileHandlerOptions = {
	maxFiles?: number;
	acceptedFileTypes?: string[];
	maxSize?: number;
	onError?: (error: string) => void;
	onValidFiles?: (files: File[]) => void;
};

export type FileValidationResult = {
	validFiles: File[];
	error: string | null;
};

export function validateFiles(
	files: FileList,
	options: FileHandlerOptions = {}
): FileValidationResult {
	const { maxFiles = 1, acceptedFileTypes = ['*/*'], maxSize = 5 * 1024 * 1024 } = options;

	const validFiles: File[] = [];
	let error: string | null = null;

	if (files.length > maxFiles) {
		return {
			validFiles: [],
			error: `Maximum ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed`
		};
	}

	Array.from(files).forEach((file) => {
		if (!acceptedFileTypes.includes('*/*') && !acceptedFileTypes.includes(file.type)) {
			error = `Invalid file type: ${file.type}`;
			return;
		}

		if (file.size > maxSize) {
			error = `File ${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`;
			return;
		}

		validFiles.push(file);
	});

	return { validFiles, error };
}

export function createFileHandlers(options: FileHandlerOptions = {}) {
	const { onError, onValidFiles } = options;

	function handleDrop(e: DragEvent) {
		e.preventDefault();

		const files = e.dataTransfer?.files;
		if (!files) return;

		const { validFiles, error } = validateFiles(files, options);

		if (error && onError) {
			onError(error);
		}

		if (validFiles.length > 0 && onValidFiles) {
			onValidFiles(validFiles);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;

		if (!files) return;

		const { validFiles, error } = validateFiles(files, options);

		if (error && onError) {
			onError(error);
		}

		if (validFiles.length > 0 && onValidFiles) {
			onValidFiles(validFiles);
		}

		// Reset the input so the same file can be selected again
		target.value = '';
	}

	return {
		handleDrop,
		handleDragOver,
		handleDragEnter,
		handleDragLeave,
		handleFileSelect
	};
}
