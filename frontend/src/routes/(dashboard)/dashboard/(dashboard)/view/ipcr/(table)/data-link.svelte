<script lang="ts">
	interface Props {
		id: string;
	}
	const prop: Props = $props();
	const viewPdf = async (id: string) => {
		try {
			const response = await fetch(`/api/ipcr/pdfDownload?id=${id}&inline=true`, {
				method: 'POST'
			});
			if (!response.ok) throw new Error('Failed to generate PDF');

			// Create blob URL and open in new tab
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');

			// Clean up blob URL after opening
			setTimeout(() => URL.revokeObjectURL(url), 100);
		} catch (error) {
			console.error('Error viewing PDF:', error);
			// Handle error appropriately
		}
	};
</script>

<button
	class="hover:underline"
	onclick={() => {
		viewPdf(prop.id);
	}}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			viewPdf(prop.id);
		}
	}}
	aria-label={`View PDF for ipcr`}>Open</button
>
