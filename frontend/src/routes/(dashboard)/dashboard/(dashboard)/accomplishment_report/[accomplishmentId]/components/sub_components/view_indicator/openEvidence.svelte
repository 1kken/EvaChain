<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Eye, File } from 'lucide-svelte';
	import type { UserEvidenceFiles } from '../../ViewIndicator.svelte';

	let { userEvidenceFile }: { userEvidenceFile: UserEvidenceFiles[] | [] } = $props();

	// Function to open file in a new tab
	function openFile(url: string) {
		window.open(url, '_blank');
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class="border-border text-foreground w-full rounded-lg border p-2">
		<span class="flex items-center justify-center gap-2">
			<Eye />
			View evidences
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="bg-card border-border sm:max-w-[625px]">
		<Dialog.Header>
			<Dialog.Title class="text-card-foreground">Evidence Files</Dialog.Title>
			<Dialog.Description class="text-muted-foreground">
				View all evidence files submitted for this indicator.
			</Dialog.Description>
		</Dialog.Header>

		<div class="border-border mt-4 overflow-hidden rounded-md border">
			<table class="w-full">
				<thead class="bg-accent text-accent-foreground text-xs uppercase">
					<tr>
						<th class="px-4 py-3 text-left">User Details</th>
						<th class="px-4 py-3 text-left">Files</th>
					</tr>
				</thead>
				<tbody class="divide-border divide-y">
					{#if userEvidenceFile.length > 0}
						{#each userEvidenceFile as evidence, index}
							<tr class={index % 2 === 0 ? 'bg-card' : 'bg-muted'}>
								<td class="px-4 py-3">
									<div class="flex flex-col">
										<span class="text-card-foreground text-sm font-medium"
											>{evidence.user_name}</span
										>
										<span class="text-muted-foreground text-sm">{evidence.user_email}</span>
									</div>
								</td>
								<td class="px-4 py-3">
									<div class="flex flex-wrap gap-2">
										{#each evidence.signed_urls as url, urlIndex}
											<button
												class="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium"
												onclick={() => openFile(url)}
											>
												<File size={16} />
												<span>Evidence</span>
											</button>
										{/each}
									</div>
								</td>
							</tr>
						{/each}
					{:else}
						<tr class="bg-card">
							<td colspan="2" class="text-muted-foreground px-4 py-4 text-center text-sm">
								No evidence files available
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<Dialog.Footer>
			<Dialog.Close
				class={buttonVariants({ variant: 'outline' }) +
					' border-border text-foreground hover:bg-accent'}
			>
				Close
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
