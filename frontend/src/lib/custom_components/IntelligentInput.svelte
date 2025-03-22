<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Loader2, CheckCircle, AlertCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import debounce from 'debounce';

	interface GrammarError {
		message: string;
		shortMessage: string;
		replacements: { value: string }[];
		offset: number;
		length: number;
		type: 'grammar' | 'spelling';
	}

	let {
		placeholder = 'Start typing to check grammar...',
		content = $bindable<string | null>(''),
		name,
		textAreaWidth = 'fit',
		disabled = false
	} = $props<{
		disabled?: boolean;
		placeholder?: string;
		content?: string | null;
		name?: string;
		textAreaWidth?: string;
	}>();

	let isFetching = $state(false);
	let errors = $state<GrammarError[]>([]);

	// Function to get corrected text
	function getCorrectedText() {
		if (!errors.length || !content) return content;

		let correctedText = content;
		const sortedErrors = [...errors].sort((a, b) => b.offset - a.offset);

		for (const error of sortedErrors) {
			if (error.replacements.length > 0) {
				correctedText =
					correctedText.substring(0, error.offset) +
					error.replacements[0].value +
					correctedText.substring(error.offset + error.length);
			}
		}
		return correctedText;
	}

	// Apply individual correction
	function applyCorrection(error: GrammarError) {
		if (!content) return;
		if (error.replacements.length > 0) {
			content =
				content.substring(0, error.offset) +
				error.replacements[0].value +
				content.substring(error.offset + error.length);
			errors = errors.filter((e) => e !== error);
		}
	}

	// Apply all corrections at once
	function applyAllCorrections() {
		content = getCorrectedText();
		errors = [];
	}

	// Update the function with proper typing
	const checkGrammar = debounce(async (text: string) => {
		if (!text || !text.trim()) {
			isFetching = false;
			errors = [];
			return;
		}

		try {
			const response = await fetch('/api/lang_tool', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: text })
			});

			if (!response.ok) {
				console.error('Grammar check failed with status:', response.status);
				throw new Error('Grammar check failed');
			}

			// Log the raw response for debugging
			const rawText = await response.text();
			console.log('Raw API response:', rawText);

			// Try to parse the response
			let data;
			try {
				data = JSON.parse(rawText);
				console.log('Parsed API response:', data);
			} catch (parseErr) {
				console.error('Failed to parse JSON response:', parseErr);
				throw new Error('Invalid response format');
			}

			// Handle both possible response formats
			let matches = Array.isArray(data) ? data : data.matches || [];

			errors = matches.map(
				(error: any): GrammarError => ({
					message: error.message || '',
					shortMessage: error.shortMessage || error.message || '',
					replacements: error.replacements || [],
					offset: error.offset || 0,
					length: error.length || 0,
					type: (error.message || '').toLowerCase().includes('spelling') ? 'spelling' : 'grammar'
				})
			);

			console.log('Processed grammar errors:', errors);
		} catch (err) {
			console.error('Grammar check error:', err);
		} finally {
			isFetching = false;
		}
	}, 2000);

	function handleInput(event: Event) {
		isFetching = true;
		checkGrammar(content || '');
	}
</script>

<div class="w-full">
	<Textarea
		{name}
		bind:value={content}
		{placeholder}
		oninput={handleInput}
		{disabled}
		class={cn(
			'min-h-[100px] resize-none',
			`max-w-${textAreaWidth}`,
			'whitespace-pre-wrap break-words', // Ensure wrapping for long text and spaces
			errors.length > 0 && 'focus:ring-yellow-500/50'
		)}
		rows={4}
		wrap="soft"
	/>

	{#if isFetching}
		<div class="text-muted-foreground flex items-center gap-2 text-xs">
			<Loader2 class="h-3 w-3 animate-spin" />
			<span>Checking...</span>
		</div>
	{/if}

	{#if errors.length > 0}
		<div class="mt-2 w-full space-y-1.5" transition:fade>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400">
					<AlertCircle class="h-4 w-4" />
					<span>Found {errors.length} {errors.length === 1 ? 'issue' : 'issues'}</span>
				</div>
				<button
					class="text-primary focus:ring-primary/50 rounded px-2 text-xs hover:underline focus:outline-none focus:ring-2"
					onclick={applyAllCorrections}
				>
					Fix All
				</button>
			</div>

			<div class="max-h-40 space-y-1 overflow-y-auto">
				{#each errors as error, i}
					<div
						class="flex items-start justify-between rounded-md bg-yellow-50 p-2 text-xs dark:bg-yellow-950"
					>
						<div>
							<div class="font-medium text-yellow-800 dark:text-yellow-300">
								{error.type === 'spelling' ? 'Spelling error' : 'Grammar issue'}
							</div>
							<div class="mt-0.5 text-yellow-700 dark:text-yellow-400">{error.message}</div>
							{#if error.replacements.length > 0}
								<div class="mt-1 text-yellow-600 dark:text-yellow-500">
									Suggestion: <span class="font-medium">{error.replacements[0].value}</span>
								</div>
							{/if}
						</div>
						{#if error.replacements.length > 0}
							<button
								class="text-primary focus:ring-primary/50 flex items-center gap-1 rounded px-1.5 hover:underline focus:outline-none focus:ring-2"
								onclick={() => applyCorrection(error)}
							>
								<CheckCircle class="h-3.5 w-3.5" />
								<span>Fix</span>
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
