import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import {zod} from "sveltekit-superforms/adapters";
import { logInSchema,signupSchema } from './schema';

//PROPS passed down to +page.svelte
export const load:PageServerLoad = async () => {
  return{
    form: {logIn:await superValidate(zod(logInSchema)),signUp:await superValidate(zod(signupSchema))} 
  }
}

//form Actions from +page.svelte
export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/auth')
    }
  },
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/private')
    }
  },
}