<script lang="ts">
	import { format, parseISO } from 'date-fns';

	const { date } = $props();
</script>

<span class="w-max">
	{date ? format(parseISO(date), 'MM/dd/yyyy') : ''}
</span>
