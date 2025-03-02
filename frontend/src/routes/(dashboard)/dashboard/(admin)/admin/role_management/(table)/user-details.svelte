<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { titleCase } from 'title-case';
	import EditRoles from './edit-roles.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UpdateUserRoleSchemaInput } from '../utils/schema';

	interface Props {
		userDetails: Tables<'profile_details_view'>;
		updateForm: SuperValidated<UpdateUserRoleSchemaInput>;
	}

	let { userDetails, updateForm }: Props = $props();
</script>

<div
	class="group relative flex items-center gap-4 border-b border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
>
	<div class="flex-1">
		<h3 class="font-medium text-gray-900 dark:text-gray-100">
			{titleCase(userDetails.full_name!)}
		</h3>
	</div>
	<div class="flex-1">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			<span class="font-semibold">Email:</span>
			{userDetails.email}
		</p>
	</div>
	<div class="flex-1">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			<span class="font-semibold">Employee ID:</span>
			{userDetails.employee_id}
		</p>
	</div>
	<EditRoles {userDetails} {updateForm} />
</div>
