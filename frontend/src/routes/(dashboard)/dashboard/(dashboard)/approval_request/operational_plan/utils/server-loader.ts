import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { uuidSchema } from '../(data)/zod_schema';

export async function getActionForms() {
	return await superValidate(zod(uuidSchema));
}
