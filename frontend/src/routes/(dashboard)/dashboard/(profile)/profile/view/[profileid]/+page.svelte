<script lang="ts">
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeftToLine } from 'lucide-svelte';
	//zod
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { profileSubmitSchema } from '$lib/schemas/profile/schema';
	import * as Select from '$lib/components/ui/select';
	import type { Tables } from '$lib/types/database.types';
	import {
		fetchOfficeByUnit,
		fetchPositionByNatureOfWork,
		fetchProgramByOffice
	} from '$lib/utils/profileHelper';
	import { onMount } from 'svelte';
	import AvatarUploadDialog from './(components)/avatar-upload-dialog.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	let { data }: { data: PageData } = $props();
	const { form: profileForm } = data;
	const { profile } = data;
	const { supabase } = data;
	const { units } = data;
	const { natureOfWork } = data;
	const { employeeStatus } = data;
	let offices = $state<Tables<'office'>[]>();
	let program = $state<Tables<'program'>[]>();
	let positions = $state<Tables<'position'>[]>();

	const form = superForm(profileForm, {
		validators: zodClient(profileSubmitSchema),
		dataType: 'json'
	});

	const { form: formData, message, enhance } = form;
	let showProgram = $derived($formData.nature_of_work_id === 1);
	let isLoadingOffices = $state(false);
	let isProgramLoading = $state(false);
	let isLoadingPositions = $state(false);

	$effect(() => {
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			invalidateAll();
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
		}
	});

	onMount(async () => {
		const promises = [];

		if ($formData.unit_id) {
			promises.push(
				fetchOfficeByUnit($formData.unit_id, supabase).then((result) => (offices = result))
			);
		}

		if ($formData.nature_of_work_id) {
			promises.push(
				fetchPositionByNatureOfWork($formData.nature_of_work_id, supabase).then(
					(result) => (positions = result)
				)
			);
		}

		if ($formData.office_id && $formData.nature_of_work_id === 1) {
			promises.push(
				fetchProgramByOffice($formData.office_id, supabase).then((result) => (program = result))
			);
		}

		await Promise.all(promises);
	});
</script>

<div class="container mx-auto p-4">
	<Card class="mx-auto w-full max-w-2xl">
		<CardHeader>
			<div class="flex justify-between">
				<Button
					onclick={async () => {
						await goto('/dashboard');
					}}
				>
					<ArrowLeftToLine />
					Back
				</Button>
				<div>
					<CardTitle>Employee Profile</CardTitle>
					<CardDescription>Update your employee information</CardDescription>
				</div>
			</div>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/updateprofile" class="space-y-4" use:enhance>
				<div class="flex justify-center p-4">
					<AvatarUploadDialog {profile} />
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Form.Field {form} name="employee_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Employee ID</Form.Label>
								<Input {...props} bind:value={$formData.employee_id} />
							{/snippet}
						</Form.Control>
						<Form.Description>This is your dmmmsu employee id.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
					<div class="space-y-2">
						<Form.Field {form} name="email">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Email</Form.Label>
									<Input {...props} bind:value={$formData.email} />
								{/snippet}
							</Form.Control>
							<Form.Description>This is your dmmmsu email id.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					<div class="space-y-2">
						<Form.Field {form} name="first_name">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>First name</Form.Label>
									<Input {...props} bind:value={$formData.first_name} />
								{/snippet}
							</Form.Control>
							<Form.Description>This is your public display name.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="space-y-2">
						<Form.Field {form} name="middle_name">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Middle name</Form.Label>
									<Input {...props} bind:value={$formData.middle_name} />
								{/snippet}
							</Form.Control>
							<Form.Description>This is your public display name.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="space-y-2">
						<Form.Field {form} name="last_name">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>last name</Form.Label>
									<Input {...props} bind:value={$formData.last_name} />
								{/snippet}
							</Form.Control>
							<Form.Description>This is your public display name.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<Form.Field {form} name="unit_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Unit</Form.Label>
									<Select.Root
										type="single"
										value={$formData.unit_id?.toString()}
										onValueChange={async (value) => {
											$formData.unit_id = value ? parseInt(value) : null;
											offices = [];
											$formData.office_id = null;
											isLoadingOffices = true;
											offices = await fetchOfficeByUnit(parseInt(value), supabase);
											isLoadingOffices = false;
										}}
									>
										<Select.Trigger {...props} class="truncate">
											{$formData.unit_id
												? units.find((u) => u.id === $formData.unit_id)?.name
												: 'Select the unit you are on.'}
										</Select.Trigger>
										<Select.Content>
											{#each units as unit (unit.id)}
												<Select.Item value={unit.id.toString()} label={unit.name} />
											{/each}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.Description>Select the unit you are on.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="space-y-2">
						<Form.Field {form} name="nature_of_work_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Nature of Work</Form.Label>
									<Select.Root
										type="single"
										value={$formData.nature_of_work_id?.toString()}
										onValueChange={async (value) => {
											$formData.nature_of_work_id = value ? parseInt(value) : null;
											positions = [];
											$formData.position_id = null;
											isLoadingPositions = true;
											positions = await fetchPositionByNatureOfWork(parseInt(value), supabase);
											isLoadingPositions = false;
										}}
									>
										<Select.Trigger {...props} class="truncate">
											{$formData.nature_of_work_id
												? natureOfWork.find((n) => n.id === $formData.nature_of_work_id)?.type
												: 'Select the unit you are on.'}
										</Select.Trigger>
										<Select.Content>
											{#each natureOfWork as now (now.id)}
												<Select.Item value={now.id.toString()} label={now.type} />
											{/each}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.Description>Select your unit.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2" class:sm:col-span-2={!showProgram}>
						<Form.Field {form} name="office_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Office</Form.Label>
									<Select.Root
										type="single"
										value={$formData.office_id?.toString()}
										onValueChange={async (value) => {
											$formData.office_id = value ? parseInt(value) : null;
											if (showProgram) {
												program = [];
												$formData.program_id = null;
												isProgramLoading = true;
												program = await fetchProgramByOffice(parseInt(value), supabase);
												isProgramLoading = false;
											}
										}}
										disabled={!$formData.unit_id || isLoadingOffices}
									>
										<Select.Trigger
											{...props}
											class={`truncate ${!showProgram ? 'w-full' : 'max-w-[350px]'}`}
										>
											{#if !$formData.unit_id}
												Please select a unit first
											{:else if isLoadingOffices}
												Loading offices...
											{:else if !offices || offices.length === 0}
												No offices available for this unit
											{:else if $formData.office_id}
												{offices.find((o) => o.id === $formData.office_id)?.name ??
													'Office not found'}
											{:else}
												Select an office
											{/if}
										</Select.Trigger>
										<Select.Content class={!showProgram ? 'w-full' : 'max-w-[350px]'}>
											{#if !$formData.unit_id}
												<Select.Item value="" disabled>Please select a unit first</Select.Item>
											{:else if isLoadingOffices}
												<Select.Item value="" disabled>Loading offices...</Select.Item>
											{:else if !offices || offices.length === 0}
												<Select.Item value="" disabled>
													No offices available for this unit
												</Select.Item>
											{:else}
												{#each offices as office (office.id)}
													<Select.Item
														value={String(office.id)}
														label={office.name}
														class="whitespace-normal break-words py-2 pr-2"
													/>
												{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.Description>Select your office you are on.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					{#if showProgram}
						<div class="space-y-2">
							<Form.Field {form} name="program_id">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Program</Form.Label>
										<Select.Root
											type="single"
											value={$formData.program_id?.toString()}
											onValueChange={(value) => {
												$formData.program_id = value ? parseInt(value) : null;
											}}
											disabled={!$formData.office_id || isProgramLoading}
										>
											<Select.Trigger {...props} class="max-w-[350px] truncate">
												{#if !$formData.office_id}
													Please select an office first
												{:else if isProgramLoading}
													Loading programs...
												{:else if !program || program.length === 0}
													No programs available for this office
												{:else if $formData.program_id}
													{program.find((p) => p.id === $formData.program_id)?.name ??
														'Program not found'}
												{:else}
													Select a program
												{/if}
											</Select.Trigger>
											<Select.Content class="max-w-[350px]">
												{#if !$formData.office_id}
													<Select.Item value="" disabled>Please select an office first</Select.Item>
												{:else if isProgramLoading}
													<Select.Item value="" disabled>Loading programs...</Select.Item>
												{:else if !program || program.length === 0}
													<Select.Item value="" disabled>
														No programs available for this office
													</Select.Item>
												{:else}
													{#each program as prog (prog.id)}
														<Select.Item
															value={String(prog.id)}
															label={prog.name}
															class="whitespace-normal break-words py-2 pr-2"
														/>
													{/each}
												{/if}
											</Select.Content>
										</Select.Root>
									{/snippet}
								</Form.Control>
								<Form.Description>Select your program.</Form.Description>
								<Form.FieldErrors />
							</Form.Field>
						</div>
					{/if}
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<Form.Field {form} name="position_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Position</Form.Label>
									<Select.Root
										type="single"
										value={$formData.position_id?.toString()}
										onValueChange={(value) => {
											$formData.position_id = value ? parseInt(value) : null;
										}}
										disabled={!$formData.nature_of_work_id || isLoadingPositions}
									>
										<Select.Trigger {...props} class=" max-w-[350px] truncate">
											<div class="truncate">
												{#if !$formData.nature_of_work_id}
													Please select nature of work first
												{:else if isLoadingPositions}
													Loading positions...
												{:else if !positions || positions.length === 0}
													No positions available
												{:else if $formData.position_id}
													{positions.find((p) => p.id === $formData.position_id)?.name ??
														'Position not found'}
												{:else}
													Select a position
												{/if}
											</div>
										</Select.Trigger>
										<Select.Content class="max-w-[350px]">
											{#if !$formData.nature_of_work_id}
												<Select.Item value="" disabled>
													Please select nature of work first
												</Select.Item>
											{:else if isLoadingPositions}
												<Select.Item value="" disabled>Loading positions...</Select.Item>
											{:else if !positions || positions.length === 0}
												<Select.Item value="" disabled>No positions available</Select.Item>
											{:else}
												{#each positions as pos (pos.id)}
													<Select.Item
														value={String(pos.id)}
														label={pos.name}
														class="whitespace-normal break-words py-2 pr-2"
													/>
												{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.Description>Select your position.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<Form.Field {form} name="employee_status_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Employee status</Form.Label>
								<Select.Root
									type="single"
									value={$formData.employee_status_id?.toString()}
									onValueChange={async (value) => {
										$formData.employee_status_id = value ? parseInt(value) : null;
										console.log($formData.employee_status_id);
									}}
								>
									<Select.Trigger {...props} class="truncate">
										{$formData.employee_status_id
											? employeeStatus.find((n) => n.id === $formData.employee_status_id)?.type
											: 'Select your employment status.'}
									</Select.Trigger>
									<Select.Content>
										{#each employeeStatus as employeeStat (employeeStat.id)}
											<Select.Item value={employeeStat.id.toString()} label={employeeStat.type} />
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.Description>Select your unit.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Button type="submit" class="w-full">Update Profile</Button>
			</form>
		</CardContent>
	</Card>
</div>
