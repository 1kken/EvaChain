import type { Tables } from '$lib/types/database.types';

export function checkProfileCompletion(profile: Tables<'profiles'> | null) {
	if (!profile) {
		return 'Profile not found';
	}

	const missingFields: string[] = [];

	if (profile.unit_id === null) {
		missingFields.push('unit');
	}

	if (profile.office_id === null) {
		missingFields.push('office');
	}

	if (missingFields.length === 0) {
		return null;
	}

	// If only one field is missing, return specific message
	if (missingFields.length === 1) {
		return `Please set your ${missingFields[0]} in your profile page.`;
	}

	// If multiple fields are missing, return general message
	return 'Please complete your profile page. Some details are missing! ';
}
