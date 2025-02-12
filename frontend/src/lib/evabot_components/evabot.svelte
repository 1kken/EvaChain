<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { MessageCircle, X, Send } from 'lucide-svelte';
	import eve from '$lib/assets/eve-head.jpg';
	import { sendBotQuery } from './helper';

	let isOpen = $state(false);
	let inputMessage = $state('');
	let isLoading = $state(false);

	const getTimeStamp = () => {
		const now = new Date();
		return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	// Sample messages for design
	const messages = $state([
		{ sender: 'ai', text: 'Hi! How can I help you today?', timestamp: getTimeStamp() }
	]);

	const handleSendMessage = async (e: Event) => {
		e.preventDefault();

		if (!inputMessage.trim()) return;

		const userMessage = {
			sender: 'user',
			text: inputMessage,
			timestamp: getTimeStamp()
		};
		messages.push(userMessage);

		inputMessage = '';
		isLoading = true;

		try {
			const response = await sendBotQuery(userMessage.text);

			// The response is already a string, use it directly
			messages.push({
				sender: 'ai',
				text: response,
				timestamp: getTimeStamp()
			});
		} catch (error) {
			console.error('Chat error:', error);
			messages.push({
				sender: 'ai',
				text: error instanceof Error ? error.message : 'An unknown error occurred',
				timestamp: getTimeStamp()
			});
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="fixed bottom-4 right-4 z-50">
	{#if isOpen}
		<Card class="flex h-96 w-80 flex-col shadow-xl">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1">
				<img src={eve} alt="Eva Bot" class="h-10 w-10 rounded-full" />
				<CardTitle class="text-sm font-semibold">Eva Bot</CardTitle>
				<Button variant="ghost" size="icon" onclick={() => (isOpen = false)}>
					<X class="h-4 w-4" />
				</Button>
			</CardHeader>

			<ScrollArea class="flex-1">
				<CardContent>
					<div class="space-y-4">
						{#each messages as message}
							<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
								<div
									class="max-w-[80%] rounded-lg px-4 py-2 {message.sender === 'user'
										? 'bg-primary text-primary-foreground ml-auto'
										: 'bg-muted'}"
								>
									<p class="text-sm">{message.text}</p>
									<span class="mt-1 block text-xs opacity-75">
										{message.timestamp}
									</span>
								</div>
							</div>
						{/each}

						{#if isLoading}
							<div class="flex justify-start">
								<div class="max-w-[80%] rounded-lg rounded-bl-none bg-gray-200 p-3 text-gray-800">
									<div class="flex gap-1">
										<div class="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
										<div
											class="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style="animation-delay: 0.2s"
										></div>
										<div
											class="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style="animation-delay: 0.4s"
										></div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</CardContent>
			</ScrollArea>

			<div class="border-t p-4">
				<form class="flex gap-2" onsubmit={handleSendMessage}>
					<Input
						type="text"
						placeholder="Type a message..."
						class="flex-1"
						bind:value={inputMessage}
						disabled={isLoading}
					/>
					<Button size="icon" type="submit" disabled={isLoading}>
						<Send class="h-4 w-4" />
					</Button>
				</form>
			</div>
		</Card>
	{:else}
		<Button
			variant="default"
			size="icon"
			class="h-14 w-14 rounded-full shadow-lg"
			onclick={() => (isOpen = true)}
		>
			<MessageCircle class="h-6 w-6" />
		</Button>
	{/if}
</div>
