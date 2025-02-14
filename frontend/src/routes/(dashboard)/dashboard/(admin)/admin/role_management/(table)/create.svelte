<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Plus, LoaderCircle, SearchIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { createUnitSchema, type CreateUnit } from '$lib/schemas/unit/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { CreateRoleWithPermissionsInput } from '../(data)/schema';
	import Permissions from './sub_components/permissions.svelte';
	import type { RoleFormData } from '.';
	import { fade } from 'svelte/transition';

	let { data }: { data: SuperValidated<Infer<CreateRoleWithPermissionsInput>> } = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let expandedModules = $state<Record<string, boolean>>({});

	const form = superForm(data, {
		validators: zodClient(createUnitSchema),
		multipleSubmits: 'prevent',
		invalidateAll: 'force'
	});

	let selectedPermissionIds = $state<number[]>([]);

	const { form: formData, enhance, message, delayed } = form;

	let permissions: RoleFormData = $state({
		name: '',
		modules: [
			{
				name: 'Strategic Plan',
				permissions: [
					{ id: 1, name: 'Create Strategic Plan', checked: false },
					{ id: 2, name: 'View Strategic Plans', checked: false },
					{ id: 3, name: 'Edit Strategic Plan', checked: false },
					{ id: 4, name: 'Delete Strategic Plan', checked: false }
				]
			},
			{
				name: 'Office Performance Commitment Review (OPCR)',
				permissions: [
					{ id: 5, name: 'Create OPCR', checked: false },
					{ id: 6, name: 'View OPCRs', checked: false },
					{ id: 7, name: 'Edit OPCR', checked: false },
					{ id: 8, name: 'Delete OPCR', checked: false }
				]
			},
			{
				name: 'Department Performance Commitment Review (DPCR)',
				permissions: [
					{ id: 9, name: 'Create DPCR', checked: false },
					{ id: 10, name: 'View DPCRs', checked: false },
					{ id: 11, name: 'Edit DPCR', checked: false },
					{ id: 12, name: 'Delete DPCR', checked: false }
				]
			},
			{
				name: 'Accomplishment Report',
				permissions: [
					{ id: 13, name: 'Create Accomplishment Report', checked: false },
					{ id: 14, name: 'View Accomplishment Reports', checked: false },
					{ id: 15, name: 'Edit Accomplishment Report', checked: false },
					{ id: 16, name: 'Delete Accomplishment Report', checked: false }
				]
			},
			{
				name: 'Individual Performance Commitment Review (IPCR)',
				permissions: [
					{ id: 17, name: 'Create IPCR', checked: false },
					{ id: 18, name: 'View IPCRs', checked: false },
					{ id: 19, name: 'Edit IPCR', checked: false },
					{ id: 20, name: 'Delete IPCR', checked: false }
				]
			}
		]
	});

	// Derived filtered modules based on search
	const filteredModules = $derived(
		permissions.modules
			.map((module) => ({
				...module,
				permissions: module.permissions.filter((permission) =>
					permission.name.toLowerCase().includes(searchQuery.toLowerCase())
				)
			}))
			.filter((module) => module.permissions.length > 0)
	);

	// Toggle module expansion
	// Toggle module expansion
	const toggleModule = (moduleName: string) => {
		expandedModules[moduleName] = !expandedModules[moduleName];
	};

	// Toggle all modules
	const toggleAllModules = () => {
		const allExpanded = permissions.modules.every((module) => expandedModules[module.name]);

		if (allExpanded) {
			// Collapse all
			expandedModules = {};
		} else {
			// Expand all
			const newExpandedState: Record<string, boolean> = {};
			permissions.modules.forEach((module) => {
				newExpandedState[module.name] = true;
			});
			expandedModules = newExpandedState;
		}
	};

	$effect(() => {
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			isOpen = false;
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
		}
	});

	$effect(() => {
		$formData.selectedPermissions = selectedPermissionIds;
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		<Plus /> Create roles
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>Create New Role</Dialog.Title>
			<Dialog.Description>
				Define role permissions by selecting modules and their actions
			</Dialog.Description>
		</Dialog.Header>

		<form action="?/createrole" method="POST" use:enhance class="space-y-6">
			<!-- Role Name Input -->
			<div class="space-y-2">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Label for="roleName">Role Name</Label>
							<Input {...props} bind:value={$formData.name} placeholder="Enter role name..." />
						{/snippet}
					</Form.Control>
					<Form.Description>Enter a name for this role</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<!-- Search and Expand Controls -->
			<div class="flex items-center gap-4">
				<div class="relative flex-1">
					<SearchIcon class="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
					<Input bind:value={searchQuery} placeholder="Search permissions..." class="pl-8" />
				</div>
				<Button type="button" variant="outline" onclick={toggleAllModules}>
					{#if permissions.modules.every((module) => expandedModules[module.name])}
						<ChevronUpIcon class="mr-2 h-4 w-4" />
						Collapse All
					{:else}
						<ChevronDownIcon class="mr-2 h-4 w-4" />
						Expand All
					{/if}
				</Button>
			</div>

			<!-- Modules and Permissions -->
			<div class="max-h-[400px] space-y-4 overflow-y-auto">
				{#each filteredModules as module (module.name)}
					<div transition:fade>
						<Permissions
							{selectedPermissionIds}
							{module}
							isExpanded={!!expandedModules[module.name]}
							onToggleExpand={() => toggleModule(module.name)}
							on:updatePermissions={(e) => (selectedPermissionIds = e.detail)}
						/>
					</div>
				{/each}
			</div>

			<!-- Submit Button -->
			{#if $delayed}
				<Button disabled class="w-full">
					<LoaderCircle class="mr-2 animate-spin" />Processing...
				</Button>
			{:else}
				<Button type="submit" class="w-full">Create Role</Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
