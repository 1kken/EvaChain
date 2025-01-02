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
		textAreaWidth = 'fit'
	} = $props<{
		placeholder?: string;
		content?: string | null;
		name?: string;
		textAreaWidth?: string;
	}>();

	let isFetching = $state(false);
	let errors = $state<GrammarError[]>([]);

	// Function to get corrected text
	function getCorrectedText() {
		if (!errors.length) return content;

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
	// First define the API response type
	interface LangToolError {
		message: string;
		shortMessage: string;
		replacements: { value: string }[];
		offset: number;
		length: number;
	}

	// Then define the extended error type with the 'type' field
	interface GrammarError extends LangToolError {
		type: 'grammar' | 'spelling';
	}

	// Update the function with proper typing
	const checkGrammar = debounce(async (text: string) => {
		if (!text.trim()) {
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

			if (!response.ok) throw new Error('Grammar check failed');

			const newErrors: LangToolError[] = await response.json();
			errors = newErrors.map(
				(error): GrammarError => ({
					...error,
					type: error.message.toLowerCase().includes('spelling') ? 'spelling' : 'grammar'
				})
			);
		} catch (err) {
			console.error('Grammar check error:', err);
		} finally {
			isFetching = false;
		}
	}, 2000);

	function handleInput() {
		isFetching = true;
		checkGrammar(content);
	}
</script>

<div class="w-full">
	<Textarea
		{name}
		bind:value={content}
		{placeholder}
		oninput={handleInput}
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
		<div class="w-full space-y-1.5" transition:fade>
			<!-- Rest of your error display code -->
		</div>
	{/if}
</div>
