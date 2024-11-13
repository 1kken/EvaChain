<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Autoplay from 'embla-carousel-autoplay';
	let text = ['Eva Chain', 'Block chain', 'Idol', 'MWAHAHAHAHA', 'I love you'];
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<Carousel.Root
		class="w-full max-w-lg"
		plugins={[
			Autoplay({
				delay: 2000
			})
		]}
	>
		<Carousel.Content>
			{#each Array(5) as _, i (i)}
				<Carousel.Item>
					<div class="p-1">
						<Card.Root>
							<Card.Content class="flex aspect-square items-center justify-center p-6">
								<span class="text-4xl font-semibold">{text[i]}</span>
							</Card.Content>
						</Card.Root>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
	</Carousel.Root>
</div>
