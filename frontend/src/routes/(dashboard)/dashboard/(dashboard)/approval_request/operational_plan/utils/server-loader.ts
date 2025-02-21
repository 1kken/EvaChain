import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { revisionSchema, uuidSchema } from '../(data)/zod_schema';

export async function getActionForms() {
	return {
		revisionForm: await superValidate(zod(revisionSchema), {}),
		uuidForm: await superValidate(zod(uuidSchema), {})
	};
}
