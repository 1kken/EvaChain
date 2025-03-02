<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { Tables } from '$lib/types/database.types';
	import { Pencil, Save, LoaderCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { titleCase } from 'title-case';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { updateUserRoleSchema, type UpdateUserRoleSchemaInput } from '../utils/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { fetchRoles, fetchUserRoles } from '../utils/page-loader';
	import { browser } from '$app/environment';

	interface Props {
		userDetails: Tables<'profile_details_view'>;
		updateForm: SuperValidated<UpdateUserRoleSchemaInput>;
	}

	let { userDetails, updateForm }: Props = $props();
	let isLoading = $state(false);

	let userRoles: Tables<'user_roles'>[] = $state([]);
	let roles: Tables<'roles'>[] = $state([]);
	let isOpen = $state(false);
	let currentRole = $state('');

	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		applyAction: false,
		validators: zodClient(updateUserRoleSchema),
		multipleSubmits: 'prevent',
		resetForm: false,
		onUpdate({ form, result }) {
			if (form.valid && result.type === 'success') {
				if (form.valid) {
					showSuccessToast(`Successfully updated role for ${titleCase(userDetails.full_name!)}`);
					isOpen = false;
				}
			}
		}
	});

	const { form: formData, enhance, delayed, message } = form;

	// Initialize form with user ID
	$formData.userId = userDetails.id!;

	// Reset form data when dialog opens
	function handleDialogOpenChange(open: boolean) {
		isOpen = open;
		if (open) {
			// Only load user roles when dialog opens
			loadUserRoles();
		}
	}

	function loadUserRoles() {
		if (!userDetails.id || userRoles.length > 0) return;

		isLoading = true;
		fetchUserRoles(userDetails.id)
			.then((result) => {
				if ('error' in result) {
					console.error('Error fetching user roles:', result.error);
					showErrorToast('Failed to load user roles');
				} else {
					userRoles = result;
					// Set the initial selected role based on existing user roles
					if (result.length > 0) {
						// Use setTimeout to ensure this happens after the component is fully rendered
						setTimeout(() => {
							currentRole = result[0].role_id.toString();
							$formData.role = result[0].role_id.toString();
						}, 0);
					}
				}
			})
			.finally(() => {
				isLoading = false;
			});
	}

	onMount(() => {
		// Fetch all roles just once
		fetchRoles().then((result) => {
			if ('error' in result) {
				console.error('Error fetching roles:', result.error);
				showErrorToast('Failed to load roles');
			} else {
				roles = result;
			}
		});
	});

	// Function to get display name for a role
	function getRoleDisplayName(roleName: string): string {
		if (roleName === 'head_of_office') {
			return 'Head of Adm. or Tech. Support';
		}
		return titleCase(roleName.split('_').join(' '));
	}

	// Synchronize form values
	function handleRoleChange(value: string) {
		currentRole = value;
		$formData.role = value;
	}

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error updating role for ${titleCase(userDetails.full_name!)}`);
			$formData.userId = userDetails.id!;
		}
	});
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={handleDialogOpenChange}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
		><Pencil class="mr-2 h-4 w-4" />Edit Roles</Dialog.Trigger
	>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>Manage Roles for {titleCase(userDetails.full_name!)}</Dialog.Title>
			<Dialog.Description>
				Assign a role for this user. Changes will take effect immediately.
			</Dialog.Description>
		</Dialog.Header>

		{#if isLoading}
			<div class="flex flex-col space-y-3 py-6">
				<Skeleton class="h-5 w-full" />
				<Skeleton class="h-5 w-5/6" />
				<Skeleton class="h-5 w-4/6" />
				<Skeleton class="h-5 w-3/6" />
			</div>
		{:else}
			<form action="?/updateuserrole" method="POST" use:enhance class="space-y-6">
				<input type="hidden" name="userId" value={$formData.userId} />

				<Form.Fieldset {form} name="role" class="space-y-4">
					<div class="space-y-3">
						<Form.Legend class="text-base font-medium">Available Roles</Form.Legend>
						<Form.Description class="text-muted-foreground text-sm">
							Select a role to assign to this user.
						</Form.Description>
					</div>

					<RadioGroup.Root
						value={currentRole}
						class="grid grid-cols-1 gap-3 md:grid-cols-2"
						name="role-display"
						onValueChange={handleRoleChange}
					>
						{#each roles as role}
							<div class="flex items-start space-x-3 rounded-md border p-3 shadow-sm">
								<Form.Control>
									{#snippet children({ props })}
										<RadioGroup.Item {...props} id={`role-${role.id}`} value={role.id.toString()} />
										<label for={`role-${role.id}`} class="ml-2 cursor-pointer text-sm font-normal">
											{getRoleDisplayName(role.name)}
										</label>
									{/snippet}
								</Form.Control>
							</div>
						{/each}
					</RadioGroup.Root>
					<Form.FieldErrors />
				</Form.Fieldset>

				<div class="flex w-full justify-end">
					{#if $delayed}
						<button
							disabled
							type="button"
							class={buttonVariants({ variant: 'default' }) + ' w-full'}
						>
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />Processing...
						</button>
					{:else}
						<Form.Button class={buttonVariants({ variant: 'default' }) + ' w-full'}>
							<Save class="mr-2 h-4 w-4" />Save
						</Form.Button>
					{/if}
				</div>
			</form>
		{/if}
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
