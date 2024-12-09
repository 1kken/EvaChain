<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import debounce from 'debounce';
	import { Loader2 } from 'lucide-svelte';

	interface Iprops {
		placeholder?: string;
		content: string;
	}

	interface GrammarError {
		message: string;
		shortMessage: string;
		replacements: { value: string }[];
		offset: number;
		length: number;
	}

	let { placeholder = 'Start typing to check grammar...', content = $bindable() }: Iprops =
		$props();
	let isFetching = $state(false);
	let errors = $state<GrammarError[]>([]);

	// Function to build corrected text
	function getCorrectedText() {
		if (!errors.length) return null;

		let correctedText = content;
		// Sort errors by offset in reverse order to avoid position shifts
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

	// Function to apply all corrections
	function applyCorrections() {
		const correctedText = getCorrectedText();
		if (correctedText) {
			content = correctedText;
			errors = [];
		}
	}

	const debouncedFetchGrammar = debounce(async (text: string) => {
		if (!text.trim()) {
			isFetching = false;
			errors = [];
			return;
		}

		try {
			const response = await fetch('/api/lang_tool', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content: text })
			});

			if (!response.ok) {
				throw new Error('Grammar check failed');
			}

			errors = await response.json();
		} catch (err) {
			console.error('Grammar check error:', err);
		} finally {
			isFetching = false;
		}
	}, 2000);

	function handleInput() {
		isFetching = true;
		debouncedFetchGrammar(content);
	}
</script>

<div class="space-y-4">
	<Textarea
		name="indicator"
		bind:value={content}
		{placeholder}
		oninput={handleInput}
		class="min-h-[120px] resize-none"
	/>

	{#if isFetching}
		<div class="text-muted-foreground flex items-center gap-2 text-sm">
			<Loader2 class="h-3 w-3 animate-spin" />
			<span>Checking grammar and spelling...</span>
		</div>
	{:else if errors.length > 0}
		<div class="bg-muted/50 space-y-2 rounded-md border p-4">
			<h3 class="font-medium">Grammar/Spelling errors detected</h3>
			<p class="text-muted-foreground text-sm">Suggested correction:</p>
			<p class="text-sm font-medium">{getCorrectedText()}</p>
			<Button variant="secondary" size="sm" onclick={applyCorrections}>
				Click to apply corrections
			</Button>
		</div>
	{/if}
</div>
