import { readonly, writable, type Writable } from 'svelte/store';

export const setIsAuth: Writable<boolean> = writable(false);
export const isAuth = readonly(setIsAuth);
