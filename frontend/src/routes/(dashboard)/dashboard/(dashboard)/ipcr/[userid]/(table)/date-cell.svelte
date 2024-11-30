<script lang="ts">
	import { format } from 'date-fns';
	export let date: string;
</script>

<span class="w-max">
	{format(new Date(date), 'MM/dd/yyyy')}
</span>
