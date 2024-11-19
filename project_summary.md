# frontend/.gitignore

```
node_modules

# Output
.output
.vercel
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

```

# frontend/.npmrc

```
engine-strict=true

```

# frontend/.prettierignore

```
# Package Managers
package-lock.json
pnpm-lock.yaml
yarn.lock

```

# frontend/.prettierrc

```
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	"overrides": [
		{
			"files": "*.svelte",
			"options": {
				"parser": "svelte"
			}
		}
	]
}

```

# frontend/components.json

```json
{
	"$schema": "https://next.shadcn-svelte.com/schema.json",
	"style": "new-york",
	"tailwind": {
		"config": "tailwind.config.ts",
		"css": "src/app.css",
		"baseColor": "neutral"
	},
	"aliases": {
		"components": "$lib/components",
		"utils": "$lib/utils",
		"ui": "$lib/components/ui",
		"hooks": "$lib/hooks"
	},
	"typescript": true,
	"registry": "https://next.shadcn-svelte.com/registry"
}

```

# frontend/eslint.config.js

```js
import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
);

```

# frontend/package.json

```json
{
	"name": "frontend",
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"format": "prettier --write .",
		"lint": "prettier --check . && eslint ."
	},
	"devDependencies": {
		"@sveltejs/adapter-auto": "^3.0.0",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^4.0.0",
		"@tailwindcss/aspect-ratio": "^0.4.2",
		"@tailwindcss/container-queries": "^0.1.1",
		"@tailwindcss/forms": "^0.5.9",
		"@tailwindcss/typography": "^0.5.15",
		"@types/eslint": "^9.6.0",
		"autoprefixer": "^10.4.20",
		"bits-ui": "^1.0.0-next.58",
		"clsx": "^2.1.1",
		"embla-carousel-svelte": "^8.3.1",
		"eslint": "^9.7.0",
		"eslint-config-prettier": "^9.1.0",
		"eslint-plugin-svelte": "^2.36.0",
		"formsnap": "^2.0.0-next.1",
		"globals": "^15.0.0",
		"mode-watcher": "^0.4.1",
		"prettier": "^3.3.2",
		"prettier-plugin-svelte": "^3.2.6",
		"prettier-plugin-tailwindcss": "^0.6.5",
		"svelte": "^5.0.0",
		"svelte-check": "^4.0.0",
		"svelte-radix": "^2.0.1",
		"svelte-sonner": "^0.3.28",
		"sveltekit-superforms": "^2.20.0",
		"tailwind-merge": "^2.5.4",
		"tailwind-variants": "^0.2.1",
		"tailwindcss": "^3.4.9",
		"tailwindcss-animate": "^1.0.7",
		"typescript": "^5.0.0",
		"typescript-eslint": "^8.0.0",
		"vite": "^5.0.3",
		"zod": "^3.23.8"
	},
	"dependencies": {
		"@supabase/ssr": "^0.5.1",
		"@supabase/supabase-js": "^2.46.1",
		"embla-carousel-autoplay": "^8.3.1",
		"lucide-svelte": "^0.460.1"
	}
}

```

# frontend/postcss.config.js

```js
export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {}
	}
};

```

# frontend/README.md

```md
# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

\`\`\`bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
\`\`\`

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

\`\`\`bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
\`\`\`

## Building

To create a production version of your app:

\`\`\`bash
npm run build
\`\`\`

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

```

# frontend/src/app.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
	:root {
		--background: 162.9 100% 95%;
		--foreground: 162.9 5% 10%;
		--card: 162.9 50% 90%;
		--card-foreground: 162.9 5% 15%;
		--popover: 162.9 100% 95%;
		--popover-foreground: 162.9 100% 10%;
		--primary: 162.9 93.5% 24.3%;
		--primary-foreground: 0 0% 100%;
		--secondary: 162.9 30% 70%;
		--secondary-foreground: 0 0% 0%;
		--muted: 124.9 30% 85%;
		--muted-foreground: 162.9 5% 35%;
		--accent: 124.9 30% 80%;
		--accent-foreground: 162.9 5% 15%;
		--destructive: 0 100% 30%;
		--destructive-foreground: 162.9 5% 90%;
		--border: 162.9 30% 50%;
		--input: 162.9 30% 26%;
		--ring: 162.9 93.5% 24.3%;
		--radius: 1rem;
	}
	.dark {
		--background: 162.9 50% 10%;
		--foreground: 162.9 5% 90%;
		--card: 162.9 50% 10%;
		--card-foreground: 162.9 5% 90%;
		--popover: 162.9 50% 5%;
		--popover-foreground: 162.9 5% 90%;
		--primary: 162.9 93.5% 24.3%;
		--primary-foreground: 0 0% 100%;
		--secondary: 162.9 30% 20%;
		--secondary-foreground: 0 0% 100%;
		--muted: 124.9 30% 25%;
		--muted-foreground: 162.9 5% 60%;
		--accent: 124.9 30% 25%;
		--accent-foreground: 162.9 5% 90%;
		--destructive: 0 100% 30%;
		--destructive-foreground: 162.9 5% 90%;
		--border: 162.9 30% 26%;
		--input: 162.9 30% 26%;
		--ring: 162.9 93.5% 24.3%;
		--radius: 1rem;
	}
}

@layer base {
	* {
		@apply border-border;
	}
	body {
		@apply bg-background text-foreground;
	}
}

```

# frontend/src/app.d.ts

```ts
// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}; // for information about these interfaces

```

# frontend/src/app.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>

```

# frontend/src/hooks.server.ts

```ts
import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Database } from '$lib/types/database.types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;
	if (!event.locals.session && event.url.pathname.startsWith('/dashboard')) {
		redirect(303, '/auth');
	}

	if (event.locals.session && event.url.pathname === '/auth') {
		redirect(303, '/dashboard');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);

```

# frontend/src/lib/components/custom/footer.svelte

```svelte
<footer>
	<span class="block text-center text-sm text-gray-500 sm:text-center dark:text-gray-400"
		>© 2024 EvaChain. All Rights Reserved.</span
	>
</footer>

```

# frontend/src/lib/components/custom/navbar.svelte

```svelte
<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	import { isAuthenticated, currentProfile } from '$lib/utils/authStore';
	import SheetNav from './sheet_nav.svelte';
	let currPathName: String = $state($page.url.pathname);

	$effect(() => {
		currPathName = $page.url.pathname;
	});

	function goToAuthPage() {
		preloadData('/auth');
		goto('/auth');
	}

	function goToDashBoard() {
		preloadData('/dashboard');
		goto('/dashboard');
	}
</script>

<nav class="border-gray-200 bg-transparent shadow-lg dark:bg-gray-900">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
			<span
				class="text-foreground self-center whitespace-nowrap text-2xl font-semibold dark:text-white"
				>EvaChain</span
			>
		</a>
		<div>
			{#if currPathName === '/' && !$isAuthenticated}
				<Button onclick={goToAuthPage}>Log-in/Sign-up</Button>
			{/if}
			{#if currPathName === '/' && $isAuthenticated}
				<Button onclick={goToDashBoard}>Go to dashboard</Button>
			{/if}
			{#if currPathName !== '/' && $isAuthenticated}
				{#if $currentProfile}
					<SheetNav profile={$currentProfile} />
				{/if}
			{/if}
		</div>
	</div>
</nav>

```

# frontend/src/lib/components/custom/sheet_nav.svelte

```svelte
<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import type { Tables } from '$lib/types/database.types';
	import { UserRoundPen } from 'lucide-svelte';
	import { LogOut } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let loading = $state(false);
	let open = $state(false);

	async function handleLogOut() {
		const { error } = await $page.data.supabase.auth.signOut();
		if (error) throw error;
		await goto('/auth');
	}

	function handleNavigate() {
		open = false; // Close sheet before navigation
	}
	let { profile }: { profile: Tables<'profiles'> | null } = $props();
</script>

<div class="flex items-center gap-2">
	<Sheet.Root bind:open>
		<Sheet.Trigger class="focus:outline-none">
			<Avatar.Root>
				<Avatar.Image
					src={profile?.avatar_url ?? undefined}
					alt={profile?.first_name ?? 'User avatar'}
				/>
				<Avatar.Fallback>
					{(profile?.first_name?.[0] ?? '') + (profile?.last_name?.[0] ?? '')}
				</Avatar.Fallback>
			</Avatar.Root>
		</Sheet.Trigger>
		<Sheet.Content side="right">
			<Sheet.Header>
				<div class="flex h-fit w-fit items-center gap-4">
					<Avatar.Root>
						<Avatar.Image
							src={profile?.avatar_url ?? undefined}
							alt={profile?.first_name ?? 'User avatar'}
						/>
						<Avatar.Fallback>
							{(profile?.first_name?.[0] ?? '') + (profile?.last_name?.[0] ?? '')}
						</Avatar.Fallback>
					</Avatar.Root>
					<h1>{profile?.first_name + ' ' + profile?.last_name}</h1>
				</div>
				<Separator />
			</Sheet.Header>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1.5">
					<h1 class="text-gray-500">Account</h1>
					<a
						href="/dashboard/profile/{profile?.id}"
						class="hover:text-green-900"
						onclick={handleNavigate}
					>
						<div class="flex w-fit gap-1.5">
							<UserRoundPen />
							<h3>Profile</h3>
						</div>
					</a>
				</div>
				<Separator />
				<div>
					<button
						class="flex w-fit cursor-pointer gap-1.5 border-none hover:text-green-900 focus:outline-none disabled:opacity-50"
						onclick={handleLogOut}
						disabled={loading}
					>
						<LogOut />
						<h5>Log-out</h5>
					</button>
				</div>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>

```

# frontend/src/lib/components/ui/alert/alert-description.svelte

```svelte
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class={cn("text-sm [&_p]:leading-relaxed", className)} {...restProps}>
	{@render children?.()}
</div>

```

# frontend/src/lib/components/ui/alert/alert-title.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		level = 5,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		level?: 1 | 2 | 3 | 4 | 5 | 6;
	} = $props();
</script>

<div
	bind:this={ref}
	aria-level={level}
	class={cn("mb-1 font-medium leading-none tracking-tight", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# frontend/src/lib/components/ui/alert/alert.svelte

```svelte
<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const alertVariants = tv({
		base: "[&>svg]:text-foreground relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
	} = $props();
</script>

<div bind:this={ref} class={cn(alertVariants({ variant }), className)} {...restProps} role="alert">
	{@render children?.()}
</div>

```

# frontend/src/lib/components/ui/alert/index.ts

```ts
import Root from "./alert.svelte";
import Description from "./alert-description.svelte";
import Title from "./alert-title.svelte";
export { alertVariants, type AlertVariant } from "./alert.svelte";

export {
	Root,
	Description,
	Title,
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle,
};

```

# frontend/src/lib/components/ui/avatar/avatar-fallback.svelte

```svelte
<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	class={cn("bg-muted flex h-full w-full items-center justify-center rounded-full", className)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/avatar/avatar-image.svelte

```svelte
<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		src,
		alt,
		ref = $bindable(null),
		...restProps
	}: AvatarPrimitive.ImageProps = $props();
</script>

<AvatarPrimitive.Image
	bind:ref
	{src}
	{alt}
	class={cn("aspect-square h-full w-full", className)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/avatar/avatar.svelte

```svelte
<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		loadingStatus = $bindable("loading"),
		...restProps
	}: AvatarPrimitive.RootProps = $props();
</script>

<AvatarPrimitive.Root
	bind:loadingStatus
	bind:ref
	class={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/avatar/index.ts

```ts
import Root from "./avatar.svelte";
import Image from "./avatar-image.svelte";
import Fallback from "./avatar-fallback.svelte";

export {
	Root,
	Image,
	Fallback,
	//
	Root as Avatar,
	Image as AvatarImage,
	Fallback as AvatarFallback,
};

```

# frontend/src/lib/components/ui/button/button.svelte

```svelte
<script lang="ts" module>
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
				outline:
					"border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}

```

# frontend/src/lib/components/ui/button/index.ts

```ts
import Root, {
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	buttonVariants,
} from "./button.svelte";

export {
	Root,
	type ButtonProps as Props,
	//
	Root as Button,
	buttonVariants,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
};

```

# frontend/src/lib/components/ui/card/card-content.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={cn("p-6", className)} {...$$restProps}>
	<slot />
</div>

```

# frontend/src/lib/components/ui/card/card-description.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLParagraphElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<p class={cn("text-muted-foreground text-sm", className)} {...$$restProps}>
	<slot />
</p>

```

# frontend/src/lib/components/ui/card/card-footer.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={cn("flex items-center p-6 pt-0", className)} {...$$restProps}>
	<slot />
</div>

```

# frontend/src/lib/components/ui/card/card-header.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={cn("flex flex-col space-y-1.5 p-6 pb-0", className)} {...$$restProps}>
	<slot />
</div>

```

# frontend/src/lib/components/ui/card/card-title.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { HeadingLevel } from "./index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		tag?: HeadingLevel;
	};

	let className: $$Props["class"] = undefined;
	export let tag: $$Props["tag"] = "h3";
	export { className as class };
</script>

<svelte:element
	this={tag}
	class={cn("font-semibold leading-none tracking-tight", className)}
	{...$$restProps}
>
	<slot />
</svelte:element>

```

# frontend/src/lib/components/ui/card/card.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cn("bg-card text-card-foreground rounded-xl border shadow", className)}
	{...$$restProps}
	on:click
	on:focusin
	on:focusout
	on:mouseenter
	on:mouseleave
>
	<slot />
</div>

```

# frontend/src/lib/components/ui/card/index.ts

```ts
import Root from "./card.svelte";
import Content from "./card-content.svelte";
import Description from "./card-description.svelte";
import Footer from "./card-footer.svelte";
import Header from "./card-header.svelte";
import Title from "./card-title.svelte";

export {
	Root,
	Content,
	Description,
	Footer,
	Header,
	Title,
	//
	Root as Card,
	Content as CardContent,
	Description as CardDescription,
	Footer as CardFooter,
	Header as CardHeader,
	Title as CardTitle,
};

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

```

# frontend/src/lib/components/ui/carousel/carousel-content.svelte

```svelte
<script lang="ts">
	import emblaCarouselSvelte from "embla-carousel-svelte";
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { getEmblaContext } from "./context.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Content/>");
</script>

<!-- svelte-ignore event_directive_deprecated -->
<div
	class="overflow-hidden"
	use:emblaCarouselSvelte={{
		options: {
			container: "[data-embla-container]",
			slides: "[data-embla-slide]",
			...emblaCtx.options,
			axis: emblaCtx.orientation === "horizontal" ? "x" : "y",
		},
		plugins: emblaCtx.plugins,
	}}
	on:emblaInit={emblaCtx.onInit}
>
	<div
		bind:this={ref}
		class={cn(
			"flex",
			emblaCtx.orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
			className
		)}
		data-embla-container=""
		{...restProps}
	>
		{@render children?.()}
	</div>
</div>

```

# frontend/src/lib/components/ui/carousel/carousel-item.svelte

```svelte
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { getEmblaContext } from "./context.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Item/>");
</script>

<div
	bind:this={ref}
	role="group"
	aria-roledescription="slide"
	class={cn(
		"min-w-0 shrink-0 grow-0 basis-full",
		emblaCtx.orientation === "horizontal" ? "pl-4" : "pt-4",
		className
	)}
	data-embla-slide=""
	{...restProps}
>
	{@render children?.()}
</div>

```

# frontend/src/lib/components/ui/carousel/carousel-next.svelte

```svelte
<script lang="ts">
	import ArrowRight from "svelte-radix/ArrowRight.svelte";
	import type { WithoutChildren } from "bits-ui";
	import { getEmblaContext } from "./context.js";
	import { cn } from "$lib/utils.js";
	import { Button, type Props } from "$lib/components/ui/button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "outline",
		size = "icon",
		...restProps
	}: WithoutChildren<Props> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Next/>");
</script>

<Button
	{variant}
	{size}
	class={cn(
		"absolute size-8 touch-manipulation rounded-full",
		emblaCtx.orientation === "horizontal"
			? "-right-12 top-1/2 -translate-y-1/2"
			: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
		className
	)}
	disabled={!emblaCtx.canScrollNext}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
	bind:ref
	{...restProps}
>
	<ArrowRight class="size-4" />
	<span class="sr-only">Next slide</span>
</Button>

```

# frontend/src/lib/components/ui/carousel/carousel-previous.svelte

```svelte
<script lang="ts">
	import ArrowLeft from "svelte-radix/ArrowLeft.svelte";
	import type { WithoutChildren } from "bits-ui";
	import { getEmblaContext } from "./context.js";
	import { cn } from "$lib/utils.js";
	import { Button, type Props } from "$lib/components/ui/button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "outline",
		size = "icon",
		...restProps
	}: WithoutChildren<Props> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Previous/>");
</script>

<Button
	{variant}
	{size}
	class={cn(
		"absolute size-8 touch-manipulation rounded-full",
		emblaCtx.orientation === "horizontal"
			? "-left-12 top-1/2 -translate-y-1/2"
			: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
		className
	)}
	disabled={!emblaCtx.canScrollPrev}
	onclick={emblaCtx.scrollPrev}
	onkeydown={emblaCtx.handleKeyDown}
	{...restProps}
	bind:ref
>
	<ArrowLeft class="size-4" />
	<span class="sr-only">Previous slide</span>
</Button>

```

# frontend/src/lib/components/ui/carousel/carousel.svelte

```svelte
<script lang="ts">
	import {
		type CarouselAPI,
		type CarouselProps,
		type EmblaContext,
		setEmblaContext,
	} from "./context.js";
	import { cn } from "$lib/utils.js";

	let {
		opts = {},
		plugins = [],
		setApi = () => {},
		orientation = "horizontal",
		class: className,
		children,
		...restProps
	}: CarouselProps = $props();

	let carouselState = $state<EmblaContext>({
		api: undefined,
		scrollPrev,
		scrollNext,
		orientation,
		canScrollNext: false,
		canScrollPrev: false,
		handleKeyDown,
		options: opts,
		plugins,
		onInit,
		scrollSnaps: [],
		selectedIndex: 0,
		scrollTo,
	});

	setEmblaContext(carouselState);

	function scrollPrev() {
		carouselState.api?.scrollPrev();
	}
	function scrollNext() {
		carouselState.api?.scrollNext();
	}
	function scrollTo(index: number, jump?: boolean) {
		carouselState.api?.scrollTo(index, jump);
	}

	function onSelect(api: CarouselAPI) {
		if (!api) return;
		carouselState.canScrollPrev = api.canScrollPrev();
		carouselState.canScrollNext = api.canScrollNext();
		carouselState.selectedIndex = api.selectedScrollSnap();
	}

	$effect(() => {
		if (carouselState.api) {
			onSelect(carouselState.api);
			carouselState.api.on("select", onSelect);
			carouselState.api.on("reInit", onSelect);
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			scrollPrev();
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			scrollNext();
		}
	}

	$effect(() => {
		setApi(carouselState.api);
	});

	function onInit(event: CustomEvent<CarouselAPI>) {
		carouselState.api = event.detail;

		carouselState.scrollSnaps = carouselState.api.scrollSnapList();
	}

	$effect(() => {
		return () => {
			carouselState.api?.off("select", onSelect);
		};
	});
</script>

<div class={cn("relative", className)} role="region" aria-roledescription="carousel" {...restProps}>
	{@render children?.()}
</div>

```

# frontend/src/lib/components/ui/carousel/context.ts

```ts
import type { EmblaCarouselSvelteType } from "embla-carousel-svelte";
import type emblaCarouselSvelte from "embla-carousel-svelte";
import { getContext, hasContext, setContext } from "svelte";
import type { WithElementRef } from "bits-ui";
import type { HTMLAttributes } from "svelte/elements";

export type CarouselAPI =
	NonNullable<NonNullable<EmblaCarouselSvelteType["$$_attributes"]>["on:emblaInit"]> extends (
		evt: CustomEvent<infer CarouselAPI>
	) => void
		? CarouselAPI
		: never;

type EmblaCarouselConfig = NonNullable<Parameters<typeof emblaCarouselSvelte>[1]>;

export type CarouselOptions = EmblaCarouselConfig["options"];
export type CarouselPlugins = EmblaCarouselConfig["plugins"];

////

export type CarouselProps = {
	opts?: CarouselOptions;
	plugins?: CarouselPlugins;
	setApi?: (api: CarouselAPI | undefined) => void;
	orientation?: "horizontal" | "vertical";
} & WithElementRef<HTMLAttributes<HTMLDivElement>>;

const EMBLA_CAROUSEL_CONTEXT = Symbol("EMBLA_CAROUSEL_CONTEXT");

export type EmblaContext = {
	api: CarouselAPI | undefined;
	orientation: "horizontal" | "vertical";
	scrollNext: () => void;
	scrollPrev: () => void;
	canScrollNext: boolean;
	canScrollPrev: boolean;
	handleKeyDown: (e: KeyboardEvent) => void;
	options: CarouselOptions;
	plugins: CarouselPlugins;
	onInit: (e: CustomEvent<CarouselAPI>) => void;
	scrollTo: (index: number, jump?: boolean) => void;
	scrollSnaps: number[];
	selectedIndex: number;
};

export function setEmblaContext(config: EmblaContext): EmblaContext {
	setContext(EMBLA_CAROUSEL_CONTEXT, config);
	return config;
}

export function getEmblaContext(name = "This component") {
	if (!hasContext(EMBLA_CAROUSEL_CONTEXT)) {
		throw new Error(`${name} must be used within a <Carousel.Root> component`);
	}
	return getContext<ReturnType<typeof setEmblaContext>>(EMBLA_CAROUSEL_CONTEXT);
}

```

# frontend/src/lib/components/ui/carousel/index.ts

```ts
import Root from "./carousel.svelte";
import Content from "./carousel-content.svelte";
import Item from "./carousel-item.svelte";
import Previous from "./carousel-previous.svelte";
import Next from "./carousel-next.svelte";

export {
	Root,
	Content,
	Item,
	Previous,
	Next,
	//
	Root as Carousel,
	Content as CarouselContent,
	Item as CarouselItem,
	Previous as CarouselPrevious,
	Next as CarouselNext,
};

```

# frontend/src/lib/components/ui/checkbox/checkbox.svelte

```svelte
<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import Check from "svelte-radix/Check.svelte";
	import Minus from "svelte-radix/Minus.svelte";
	import { cn } from "$lib/utils.js";

	type $$Props = CheckboxPrimitive.Props;
	type $$Events = CheckboxPrimitive.Events;

	let className: $$Props["class"] = undefined;
	export let checked: $$Props["checked"] = false;
	export { className as class };
</script>

<CheckboxPrimitive.Root
	class={cn(
		"border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer box-content h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
		className
	)}
	bind:checked
	on:click
	{...$$restProps}
>
	<CheckboxPrimitive.Indicator
		class={cn("flex h-4 w-4 items-center justify-center text-current")}
		let:isChecked
		let:isIndeterminate
	>
		{#if isIndeterminate}
			<Minus class="h-3.5 w-3.5" />
		{:else}
			<Check class={cn("h-3.5 w-3.5", !isChecked && "text-transparent")} />
		{/if}
	</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>

```

# frontend/src/lib/components/ui/checkbox/index.ts

```ts
import Root from "./checkbox.svelte";
export {
	Root,
	//
	Root as Checkbox,
};

```

# frontend/src/lib/components/ui/form/form-button.svelte

```svelte
<script lang="ts">
	import * as Button from "$lib/components/ui/button/index.js";

	let { ref = $bindable(null), ...restProps }: Button.Props = $props();
</script>

<Button.Root type="submit" bind:ref {...restProps} />

```

# frontend/src/lib/components/ui/form/form-description.svelte

```svelte
<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import type { WithoutChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChild<FormPrimitive.DescriptionProps> = $props();
</script>

<FormPrimitive.Description
	bind:ref
	class={cn("text-muted-foreground text-[0.8rem]", className)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/form/form-element-field.svelte

```svelte
<script lang="ts" module>
	import type { FormPathLeaves as _FormPathLeaves } from "sveltekit-superforms";
	type T = Record<string, unknown>;
	type U = _FormPathLeaves<T>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends _FormPathLeaves<T>">
	import * as FormPrimitive from "formsnap";
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		form,
		name,
		children: childrenProp,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> &
		FormPrimitive.ElementFieldProps<T, U> = $props();
</script>

<FormPrimitive.ElementField {form} {name}>
	{#snippet children({ constraints, errors, tainted, value })}
		<div bind:this={ref} class={cn("space-y-2", className)} {...restProps}>
			{@render childrenProp?.({ constraints, errors, tainted, value: value as T[U] })}
		</div>
	{/snippet}
</FormPrimitive.ElementField>

```

# frontend/src/lib/components/ui/form/form-field-errors.svelte

```svelte
<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import type { WithoutChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		errorClasses,
		children: childrenProp,
		...restProps
	}: WithoutChild<FormPrimitive.FieldErrorsProps> & {
		errorClasses?: string | undefined | null;
	} = $props();
</script>

<FormPrimitive.FieldErrors
	class={cn("text-destructive text-[0.8rem] font-medium", className)}
	{...restProps}
>
	{#snippet children({ errors, errorProps })}
		{#if childrenProp}
			{@render childrenProp({ errors, errorProps })}
		{:else}
			{#each errors as error}
				<div {...errorProps} class={cn(errorClasses)}>{error}</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>

```

# frontend/src/lib/components/ui/form/form-field.svelte

```svelte
<script lang="ts" module>
	import type { FormPath as _FormPath } from "sveltekit-superforms";
	type T = Record<string, unknown>;
	type U = _FormPath<T>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends _FormPath<T>">
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils.js";
	import type { WithElementRef, WithoutChildren } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		form,
		name,
		children: childrenProp,
		...restProps
	}: FormPrimitive.FieldProps<T, U> &
		WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<FormPrimitive.Field {form} {name}>
	{#snippet children({ constraints, errors, tainted, value })}
		<div bind:this={ref} class={cn("space-y-2", className)} {...restProps}>
			{@render childrenProp?.({ constraints, errors, tainted, value: value as T[U] })}
		</div>
	{/snippet}
</FormPrimitive.Field>

```

# frontend/src/lib/components/ui/form/form-fieldset.svelte

```svelte
<script lang="ts" module>
	import type { FormPath as _FormPath } from "sveltekit-superforms";
	type T = Record<string, unknown>;
	type U = _FormPath<T>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends _FormPath<T>">
	import * as FormPrimitive from "formsnap";
	import type { WithoutChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		form,
		name,
		...restProps
	}: WithoutChild<FormPrimitive.FieldsetProps<T, U>> = $props();
</script>

<FormPrimitive.Fieldset bind:ref {form} {name} class={cn("space-y-2", className)} {...restProps} />

```

# frontend/src/lib/components/ui/form/form-label.svelte

```svelte
<script lang="ts">
	import type { WithoutChild } from "bits-ui";
	import * as FormPrimitive from "formsnap";
	import { Label } from "$lib/components/ui/label/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		children,
		class: className,
		...restProps
	}: WithoutChild<FormPrimitive.LabelProps> = $props();
</script>

<FormPrimitive.Label {...restProps} bind:ref>
	{#snippet child({ props })}
		<Label {...props} class={cn("data-[fs-error]:text-destructive", className)}>
			{@render children?.()}
		</Label>
	{/snippet}
</FormPrimitive.Label>

```

# frontend/src/lib/components/ui/form/form-legend.svelte

```svelte
<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import type { WithoutChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChild<FormPrimitive.LegendProps> = $props();
</script>

<FormPrimitive.Legend
	bind:ref
	{...restProps}
	class={cn("data-[fs-error]:text-destructive text-sm font-medium leading-none", className)}
/>

```

# frontend/src/lib/components/ui/form/index.ts

```ts
import * as FormPrimitive from "formsnap";
import Description from "./form-description.svelte";
import Label from "./form-label.svelte";
import FieldErrors from "./form-field-errors.svelte";
import Field from "./form-field.svelte";
import Button from "./form-button.svelte";
import Fieldset from "./form-fieldset.svelte";
import Legend from "./form-legend.svelte";
import ElementField from "./form-element-field.svelte";

const Control = FormPrimitive.Control as typeof FormPrimitive.Control;

export {
	Field,
	Control,
	Label,
	FieldErrors,
	Description,
	Fieldset,
	Legend,
	ElementField,
	Button,
	//
	Field as FormField,
	Control as FormControl,
	Description as FormDescription,
	Label as FormLabel,
	FieldErrors as FormFieldErrors,
	Fieldset as FormFieldset,
	Legend as FormLegend,
	ElementField as FormElementField,
	Button as FormButton,
};

```

# frontend/src/lib/components/ui/input/index.ts

```ts
import Root from "./input.svelte";

export {
	Root,
	//
	Root as Input,
};

```

# frontend/src/lib/components/ui/input/input.svelte

```svelte
<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes> = $props();
</script>

<input
	bind:this={ref}
	class={cn(
		"border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	bind:value
	{...restProps}
/>

```

# frontend/src/lib/components/ui/label/index.ts

```ts
import Root from "./label.svelte";

export {
	Root,
	//
	Root as Label,
};

```

# frontend/src/lib/components/ui/label/label.svelte

```svelte
<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: LabelPrimitive.RootProps = $props();
</script>

<LabelPrimitive.Root
	bind:ref
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/select/index.ts

```ts
import { Select as SelectPrimitive } from "bits-ui";

import GroupHeading from "./select-group-heading.svelte";
import Item from "./select-item.svelte";
import Content from "./select-content.svelte";
import Trigger from "./select-trigger.svelte";
import Separator from "./select-separator.svelte";
import ScrollDownButton from "./select-scroll-down-button.svelte";
import ScrollUpButton from "./select-scroll-up-button.svelte";

const Root = SelectPrimitive.Root;
const Group = SelectPrimitive.Group;

export {
	Root,
	Item,
	Group,
	GroupHeading,
	Content,
	Trigger,
	Separator,
	ScrollDownButton,
	ScrollUpButton,
	//
	Root as Select,
	Item as SelectItem,
	Group as SelectGroup,
	GroupHeading as SelectGroupHeading,
	Content as SelectContent,
	Trigger as SelectTrigger,
	Separator as SelectSeparator,
	ScrollDownButton as SelectScrollDownButton,
	ScrollUpButton as SelectScrollUpButton,
};

```

# frontend/src/lib/components/ui/select/select-content.svelte

```svelte
<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
	import * as Select from "$lib/components/ui/select/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.ContentProps> = $props();
</script>

<SelectPrimitive.Portal>
	<SelectPrimitive.Content
		bind:ref
		{sideOffset}
		class={cn(
			"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
			className
		)}
		{...restProps}
	>
		<Select.ScrollUpButton />
		<SelectPrimitive.Viewport
			class={cn(
				"h-[var(--bits-select-anchor-height)] w-full min-w-[var(--bits-select-anchor-width)] p-1"
			)}
		>
			{@render children?.()}
		</SelectPrimitive.Viewport>
		<Select.ScrollDownButton />
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>

```

# frontend/src/lib/components/ui/select/select-group-heading.svelte

```svelte
<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SelectPrimitive.GroupHeadingProps = $props();
</script>

<SelectPrimitive.GroupHeading
	bind:ref
	class={cn("px-2 py-1.5 text-sm font-semibold", className)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/select/select-item.svelte

```svelte
<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
	import Check from "svelte-radix/Check.svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		...restProps
	}: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	class={cn(
		"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute right-2 flex size-3.5 items-center justify-center">
			{#if selected}
				<Check class="size-4" />
			{/if}
		</span>
		{#if childrenProp}
			{@render childrenProp({ selected, highlighted })}
		{:else}
			{label || value}
		{/if}
	{/snippet}
</SelectPrimitive.Item>

```

# frontend/src/lib/components/ui/select/select-label.svelte

```svelte
<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SelectPrimitive.LabelProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Label class={cn("px-2 py-1.5 text-sm font-semibold", className)} {...$$restProps}>
	<slot />
</SelectPrimitive.Label>

```

# frontend/src/lib/components/ui/select/select-scroll-down-button.svelte

```svelte
<script lang="ts">
	import ChevronDown from "svelte-radix/ChevronDown.svelte";
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollDownButton
	bind:ref
	class={cn("flex cursor-default items-center justify-center py-1", className)}
	{...restProps}
>
	<ChevronDown class="size-4" />
</SelectPrimitive.ScrollDownButton>

```

# frontend/src/lib/components/ui/select/select-scroll-up-button.svelte

```svelte
<script lang="ts">
	import ChevronUp from "svelte-radix/ChevronUp.svelte";
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
	bind:ref
	class={cn("flex cursor-default items-center justify-center py-1", className)}
	{...restProps}
>
	<ChevronUp class="size-4" />
</SelectPrimitive.ScrollUpButton>

```

# frontend/src/lib/components/ui/select/select-separator.svelte

```svelte
<script lang="ts">
	import type { Separator as SeparatorPrimitive } from "bits-ui";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<Separator bind:ref class={cn("bg-muted -mx-1 my-1 h-px", className)} {...restProps} />

```

# frontend/src/lib/components/ui/select/select-trigger.svelte

```svelte
<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
	import CaretSort from "svelte-radix/CaretSort.svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		"border-input ring-offset-background data-[placeholder]:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<CaretSort class="size-4 opacity-50" />
</SelectPrimitive.Trigger>

```

# frontend/src/lib/components/ui/separator/index.ts

```ts
import Root from "./separator.svelte";

export {
	Root,
	//
	Root as Separator,
};

```

# frontend/src/lib/components/ui/separator/separator.svelte

```svelte
<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "horizontal",
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<SeparatorPrimitive.Root
	bind:ref
	class={cn(
		"bg-border shrink-0",
		orientation === "horizontal" ? "h-[1px] w-full" : "min-h-full w-[1px]",
		className
	)}
	{orientation}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/sheet/index.ts

```ts
import { Dialog as SheetPrimitive } from "bits-ui";

import Overlay from "./sheet-overlay.svelte";
import Content from "./sheet-content.svelte";
import Header from "./sheet-header.svelte";
import Footer from "./sheet-footer.svelte";
import Title from "./sheet-title.svelte";
import Description from "./sheet-description.svelte";

const Root = SheetPrimitive.Root;
const Close = SheetPrimitive.Close;
const Trigger = SheetPrimitive.Trigger;
const Portal = SheetPrimitive.Portal;

export {
	Root,
	Close,
	Trigger,
	Portal,
	Overlay,
	Content,
	Header,
	Footer,
	Title,
	Description,
	//
	Root as Sheet,
	Close as SheetClose,
	Trigger as SheetTrigger,
	Portal as SheetPortal,
	Overlay as SheetOverlay,
	Content as SheetContent,
	Header as SheetHeader,
	Footer as SheetFooter,
	Title as SheetTitle,
	Description as SheetDescription,
};

```

# frontend/src/lib/components/ui/sheet/sheet-content.svelte

```svelte
<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const sheetVariants = tv({
		base: "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
		variants: {
			side: {
				top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b",
				bottom: "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t",
				left: "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
				right: "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
			},
		},
		defaultVariants: {
			side: "right",
		},
	});

	export type Side = VariantProps<typeof sheetVariants>["side"];
</script>

<script lang="ts">
	import { Dialog as SheetPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import Cross2 from "svelte-radix/Cross2.svelte";
	import type { Snippet } from "svelte";
	import SheetOverlay from "./sheet-overlay.svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		side = "right",
		children,
		...restProps
	}: WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
		side?: Side;
		children: Snippet;
	} = $props();
</script>

<SheetPrimitive.Portal>
	<SheetOverlay />
	<SheetPrimitive.Content bind:ref class={cn(sheetVariants({ side }), className)} {...restProps}>
		{@render children?.()}
		<SheetPrimitive.Close
			class="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
		>
			<Cross2 class="size-4" />
			<span class="sr-only">Close</span>
		</SheetPrimitive.Close>
	</SheetPrimitive.Content>
</SheetPrimitive.Portal>

```

# frontend/src/lib/components/ui/sheet/sheet-description.svelte

```svelte
<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.DescriptionProps = $props();
</script>

<SheetPrimitive.Description
	bind:ref
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/sheet/sheet-footer.svelte

```svelte
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# frontend/src/lib/components/ui/sheet/sheet-header.svelte

```svelte
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
	{...restProps}
>
	{@render children?.()}
</div>

```

# frontend/src/lib/components/ui/sheet/sheet-overlay.svelte

```svelte
<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.OverlayProps = $props();
</script>

<SheetPrimitive.Overlay
	bind:ref
	class={cn(
		"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  fixed inset-0 z-50 bg-black/80",
		className
	)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/sheet/sheet-title.svelte

```svelte
<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.TitleProps = $props();
</script>

<SheetPrimitive.Title
	bind:ref
	class={cn("text-foreground text-lg font-semibold", className)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/sonner/index.ts

```ts
export { default as Toaster } from "./sonner.svelte";

```

# frontend/src/lib/components/ui/sonner/sonner.svelte

```svelte
<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { mode } from "mode-watcher";

	let restProps: SonnerProps = $props();
</script>

<Sonner
	theme={$mode}
	class="toaster group"
	toastOptions={{
		classes: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
		},
	}}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/tabs/index.ts

```ts
import { Tabs as TabsPrimitive } from "bits-ui";
import Content from "./tabs-content.svelte";
import List from "./tabs-list.svelte";
import Trigger from "./tabs-trigger.svelte";

const Root = TabsPrimitive.Root;

export {
	Root,
	Content,
	List,
	Trigger,
	//
	Root as Tabs,
	Content as TabsContent,
	List as TabsList,
	Trigger as TabsTrigger,
};

```

# frontend/src/lib/components/ui/tabs/tabs-content.svelte

```svelte
<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		...restProps
	}: TabsPrimitive.ContentProps = $props();
</script>

<TabsPrimitive.Content
	bind:ref
	class={cn(
		"ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
		className
	)}
	{value}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/tabs/tabs-list.svelte

```svelte
<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.ListProps = $props();
</script>

<TabsPrimitive.List
	bind:ref
	class={cn(
		"bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1",
		className
	)}
	{...restProps}
/>

```

# frontend/src/lib/components/ui/tabs/tabs-trigger.svelte

```svelte
<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		...restProps
	}: TabsPrimitive.TriggerProps = $props();
</script>

<TabsPrimitive.Trigger
	bind:ref
	class={cn(
		"ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow",
		className
	)}
	{value}
	{...restProps}
/>

```

# frontend/src/lib/index.ts

```ts
// place files you want to import through the `$lib` alias in this folder.

```

# frontend/src/lib/types/database.types.ts

```ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      employee_status: {
        Row: {
          created_at: string
          id: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      nature_of_work: {
        Row: {
          created_at: string
          id: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      office: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          unit_id: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
          unit_id: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      position: {
        Row: {
          created_at: string
          id: number
          name: string
          nature_of_work_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          nature_of_work_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          nature_of_work_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          employee_id: string | null
          employee_status_id: number | null
          first_name: string | null
          id: string
          last_name: string | null
          middle_name: string | null
          nature_of_work_id: number | null
          office_id: number | null
          position_id: number | null
          programme_id: number | null
          unit_id: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          employee_status_id?: number | null
          first_name?: string | null
          id: string
          last_name?: string | null
          middle_name?: string | null
          nature_of_work_id?: number | null
          office_id?: number | null
          position_id?: number | null
          programme_id?: number | null
          unit_id?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          employee_status_id?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          nature_of_work_id?: number | null
          office_id?: number | null
          position_id?: number | null
          programme_id?: number | null
          unit_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_employee_status_id_fkey"
            columns: ["employee_status_id"]
            isOneToOne: false
            referencedRelation: "employee_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "position"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      programme: {
        Row: {
          created_at: string
          id: number
          name: string
          office_id: number
          unit_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          office_id: number
          unit_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          office_id?: number
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programme_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programme_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      unit: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never


```

# frontend/src/lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

```

# frontend/src/lib/utils/authStore.ts

```ts
// src/lib/stores/authStore.ts
import { writable, derived } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

export const currentProfile = writable<Tables<'profiles'> | null>(null);
export const isAuthenticated = writable(false);

export const authStore = {
	// Function to fetch and update profile
	async fetchProfile(supabase: SupabaseClient) {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user?.id) {
			currentProfile.set(null);
			isAuthenticated.set(false);
			return;
		}

		const { data: profile }: { data: Tables<'profiles'> | null } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();

		currentProfile.set(profile);
		isAuthenticated.set(!!profile);
	},

	setProfile: (profile: Tables<'profiles'> | null) => {
		currentProfile.set(profile);
		isAuthenticated.set(!!profile);
	},

	clearProfile: () => {
		currentProfile.set(null);
		isAuthenticated.set(false);
	}
};

```

# frontend/src/lib/utils/profileHelper.ts

```ts
import type { Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { NavigationMenuLinkPropsWithoutHTML } from 'bits-ui';

export const fetchOfficeByUnit = async (
	unitId: number | null,
	supabase: SupabaseClient
): Promise<Tables<'office'>[]> => {
	const { data, error } = await supabase.from('office').select('*').eq('unit_id', unitId);

	if (error) {
		throw error;
	}

	return data || [];
};

export const fetchProgrammeByOffice = async (
	officeId: number | null,
	supabase: SupabaseClient
): Promise<Tables<'programme'>[]> => {
	const { data, error } = await supabase.from('programme').select('*').eq('office_id', officeId);

	if (error) {
		throw error;
	}

	return data || [];
};

export const fetchPositionByNatureOfWork = async (
	natureOfWorkId: number | null,
	supabase: SupabaseClient
): Promise<Tables<'position'>[]> => {
	const { data, error } = await supabase
		.from('position')
		.select('*')
		.eq('nature_of_work_id', natureOfWorkId);

	if (error) {
		throw error;
	}

	return data || [];
};

```

# frontend/src/lib/utils/toast.ts

```ts
import { toast } from 'svelte-sonner';

export const showSuccessToast = (message: string) => {
	toast.success(message);
};

export const showErrorToast = (message: string) => {
	toast.error(message);
};

export const showWarningToast = (message: string) => {
	toast.warning(message);
};

```

# frontend/src/routes/+layout.server.ts

```ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();
	return {
		session,
		cookies: cookies.getAll()
	};
};

```

# frontend/src/routes/+layout.svelte

```svelte
<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import Footer from '$lib/components/custom/footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { authStore } from '$lib/utils/authStore';
	let { children, data } = $props();

	let { session, supabase } = $derived(data);

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (event === 'SIGNED_OUT') {
				authStore.clearProfile();
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster richColors position="top-right" />
<Navbar />
{@render children()}
<Footer />

```

# frontend/src/routes/+layout.ts

```ts
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import type { Database } from '$lib/types/database.types';
export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return { session, supabase, user };
};

```

# frontend/src/routes/+page.svelte

```svelte
<script lang="ts">
</script>

```

# frontend/src/routes/auth/+layout.svelte

```svelte
<script lang="ts">
	let { children } = $props();
</script>

<div class="relative flex h-screen w-screen items-center justify-center">
	{@render children()}
</div>

```

# frontend/src/routes/auth/+page.server.ts

```ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { logInSchema, signupSchema } from './schema';

//PROPS passed down to +page.svelte
export const load: PageServerLoad = async () => {
	return {
		form: {
			logIn: await superValidate(zod(logInSchema)),
			signUp: await superValidate(zod(signupSchema))
		}
	};
};

//form Actions from +page.svelte
export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		// Server side validation
		const form = await superValidate(request, zod(signupSchema));
		// If not valid return the form with errors
		if (!form.valid) {
			console.log(form);
			return fail(400, {
				form
			});
		}

		// If form valid, use the validated data from superValidate
		const { email, password, firstName, lastName } = form.data;

		function handleName(name: string): string {
			//remove all extra spaces then join with one space
			return name.toLowerCase().split(/\s+/).join(' ');
		}

		// Attempt signup with Supabase
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: handleName(firstName),
					last_name: handleName(lastName)
				}
			}
		});
		// If Supabase returns an error
		if (error) {
			console.error(error);
			// Return both the form and the error message
			return fail(400, {
				form,
				message: error.message
			});
		}

		// If success, return both form and success message
		return {
			form,
			success: true,
			message: 'Account created successfully! Please check your email.'
		};
	},
	login: async ({ request, locals: { supabase } }) => {
		// Server side validation
		const form = await superValidate(request, zod(logInSchema));
		// If not valid return the form with errors
		if (!form.valid) {
			console.log(form);
			return fail(400, {
				form
			});
		}

		// If form valid, use the validated data from superValidate
		const { email, password } = form.data;
		// Attempt signup with Supabase
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		// If Supabase returns an error
		if (error) {
			console.error(error);
			// Return both the form and the error message
			return fail(400, {
				form,
				message: error.message
			});
		}

		// If success, return both form and success message
		return {
			form,
			success: true,
			message: 'Log successful!'
		};
	}
};

```

# frontend/src/routes/auth/+page.svelte

```svelte
<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { PageServerData } from './$types';
	import LogInForm from './logInForm.svelte';
	import SignupForm from './signupForm.svelte';
	let { data }: { data: PageServerData } = $props();
</script>

<div class="  mt-10 grid h-full w-96">
	<Tabs.Root value="login">
		<Tabs.List class="grid grid-cols-2 items-center">
			<Tabs.Trigger value="login">Log in</Tabs.Trigger>
			<Tabs.Trigger value="signup">Sign up</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="login">
			<LogInForm data={data.form.logIn} />
		</Tabs.Content>
		<Tabs.Content value="signup"><SignupForm data={data.form.signUp} /></Tabs.Content>
	</Tabs.Root>
</div>

```

# frontend/src/routes/auth/callback/+server.ts

```ts
import { redirect, type RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const {
			data: { session },
			error
		} = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			throw new Error('Google 0auth error!');
		}

		if (!error && session?.provider_token) {
			// Fetch Google profile
			const userResponse = await fetch(
				`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${session.provider_token}`
			);
			const userData = await userResponse.json();

			// Update Supabase profile
			const { error } = await supabase.from('profiles').upsert({
				id: session.user.id,
				first_name: userData.given_name,
				last_name: userData.family_name
			});

			if (error) {
				throw new Error('Setting user data google to db error');
			}

			throw redirect(303, `/${next.slice(1)}`);
		}
	}

	throw redirect(303, '/auth/auth-code-error');
};

```

# frontend/src/routes/auth/confirm/+server.ts

```ts
import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/'

  /**
   * Clean up the redirect URL by deleting the Auth flow parameters.
   *
   * `next` is preserved for now, because it's needed in the error case.
   */
  const redirectTo = new URL(url)
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      redirectTo.searchParams.delete('next')
      redirect(303, redirectTo)
    }
  }

  redirectTo.pathname = '/auth/error'
  redirect(303, redirectTo)
}
```

# frontend/src/routes/auth/error/+page.svelte

```svelte
<p>Login error</p>

```

# frontend/src/routes/auth/google/+server.ts

```ts
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: new URL('/auth/callback', url.origin).toString() + '?next=/dashboard'
			// queryParams: {
			// 	hd: 'dmmmsu.edu.ph'
			// }
		}
	});

	console.log(data);
	if (data.url) {
		throw redirect(307, data.url); // use the redirect API for your server framework
	}

	redirect(307, 'auth/error');
};

```

# frontend/src/routes/auth/logInForm.svelte

```svelte
<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { logInSchema, type LogInSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<LogInSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(logInSchema)
	});

	const { form: formData, enhance: logInEnhance } = form;
	$effect(() => {
		if ($page.form?.success) {
			showSuccessToast($page.form.message);
			goto('/private');
		} else if ($page.form?.message) {
			showErrorToast($page.form.message);
		}
	});
</script>

<div></div>

<Card.Root>
	<Card.Content>
		<Card.CardHeader class="flex items-center">
			<Card.Title>Welcome Back to EvaChain!</Card.Title>
		</Card.CardHeader>
		<form method="POST" action="?/login" use:logInEnhance>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input placeholder="Enter Email" {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input
							placeholder="Enter Password"
							{...props}
							bind:value={$formData.password}
							type="password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex justify-end"></div>
			<Form.Button class="mt-2 w-full">Log In</Form.Button>
		</form>
		<div class="grid w-full grid-cols-1 place-items-center gap-3">
			<div class="flex w-full items-center text-gray-900">
				<hr class="flex-grow border-green-700" />
				<h3 class="px-3">or</h3>
				<hr class="flex-grow border-green-700" />
			</div>
			<Button href="/auth/google">Continue with Google</Button>
		</div>
	</Card.Content>
</Card.Root>

```

# frontend/src/routes/auth/schema.ts

```ts
import { z } from 'zod';
export const logInSchema = z.object({
	email: z
		.string()
		.email()
		.regex(/'^[a-zA-Z0-9._%+-]+@dmmmsu\.edu\.ph$'/, 'Only dmmmsu.edu.ph email is allowed'),
	password: z.string().min(6)
});

export const signupSchema = z
	.object({
		firstName: z
			.string()
			.min(3)
			.regex(/^[A-Za-z]+$/, 'Names cannot contain numbers'),
		lastName: z
			.string()
			.min(3)
			.regex(/^[A-Za-z]+$/, 'Names cannot contain numbers'),
		email: z
			.string()
			.email()
			.regex(/'^[a-zA-Z0-9._%+-]+@dmmmsu\.edu\.ph$'/, 'Only dmmmsu.edu.ph email is allowed'),
		password: z.string().min(6),
		passwordRepeat: z.string().min(6)
	})
	.refine((data) => data.password === data.passwordRepeat, {
		message: "Passwords don't match",
		path: ['passwordRepeat']
	});

export type LogInSchema = typeof logInSchema;

export type SignupSchema = typeof signupSchema;

```

# frontend/src/routes/auth/signupForm.svelte

```svelte
<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { signupSchema, type SignupSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<SignupSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signupSchema)
	});

	const { form: formData, enhance: logInEnhance } = form;
	$effect(() => {
		if ($page.form?.success) {
			showSuccessToast($page.form.message);
			goto('/auth');
		} else if ($page.form?.message) {
			showErrorToast($page.form.message);
		}
	});
</script>

<Card.Root>
	<Card.Content>
		<form method="POST" action="?/signup" use:logInEnhance>
			<div class="grid grid-cols-2 gap-2">
				<Form.Field {form} name="firstName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>First Name</Form.Label>
							<Input {...props} bind:value={$formData.firstName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="lastName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Last Name</Form.Label>
							<Input {...props} bind:value={$formData.lastName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input {...props} bind:value={$formData.password} type="password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="passwordRepeat">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm Password</Form.Label>
						<Input {...props} bind:value={$formData.passwordRepeat} type="password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="mt-2 w-full">Sign Up</Form.Button>
		</form>
	</Card.Content>
</Card.Root>

```

# frontend/src/routes/dashboard/+layout.server.ts

```ts
/**
 * This file is necessary to ensure protection of all routes in the `private`
 * directory. It makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 **/

```

# frontend/src/routes/dashboard/+layout.svelte

```svelte
<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Tables } from '$lib/types/database.types.js';
	import { authStore } from '$lib/utils/authStore.js';
	import { onMount, setContext } from 'svelte';

	let { data, children } = $props();
	onMount(() => {
		authStore.fetchProfile(data.supabase);
	});
</script>

<main>
	{@render children()}
</main>

```

# frontend/src/routes/dashboard/+page.server.ts

```ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ depends, locals: { supabase, user } }) => {
	if (!user) {
		throw error(401, 'Unauthorized');
	}
};

```

# frontend/src/routes/dashboard/+page.svelte

```svelte
<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

```

# frontend/src/routes/dashboard/profile/[profileid]/+page.server.ts

```ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { profileSchema, profileSubmitSchema } from './schema';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	if (!params.profileid) {
		throw error(404, 'Profile ID not found');
	}

	const { data: profile, error: err } = await supabase
		.from('profiles')
		.select()
		.eq('id', params.profileid)
		.single();

	if (err) {
		throw error(500, 'Failed to load profile');
	}

	if (!profile) {
		throw error(404, 'Profile not found');
	}

	const { data: units, error: unitErr } = await supabase.from('unit').select();

	if (unitErr) {
		throw error(500, 'Failed to load units');
	}

	const { data: natureOfWork, error: nowErr } = await supabase.from('nature_of_work').select();

	if (nowErr) {
		throw error(500, 'Failed to load nature of work');
	}

	const { data: employeeStatus, error: employeeStatusErr } = await supabase
		.from('employee_status')
		.select();

	if (employeeStatusErr) {
		throw error(500, 'Failed to load employee status');
	}

	return {
		profile,
		employeeStatus,
		units,
		natureOfWork,
		form: await superValidate(profile, zod(profileSchema))
	};
};

export const actions: Actions = {
	updateprofile: async ({ request, locals: { supabase, session } }) => {
		const test = await request.formData();
		const form = await superValidate(test, zod(profileSubmitSchema));
		console.log(form.data.unit_id);
		// If not valid return the form with errors
		if (!form.valid) {
			console.log(form);
			return fail(400, {
				form
			});
		}
		const {
			first_name,
			last_name,
			middle_name,
			employee_id,
			unit_id,
			nature_of_work_id,
			office_id,
			programme_id,
			position_id,
			employee_status_id
		} = form.data;

		if (!session?.user) {
			redirect(401, 'Unauthorized');
		}
		//update
		const { error } = await supabase
			.from('profiles')
			.update({
				first_name,
				last_name,
				middle_name,
				employee_id,
				unit_id,
				nature_of_work_id,
				office_id,
				programme_id,
				position_id,
				employee_status_id
			})
			.eq('id', session?.user.id);
	}
};

```

# frontend/src/routes/dashboard/profile/[profileid]/+page.svelte

```svelte
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
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	//zod
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { profileSubmitSchema } from './schema';
	import * as Select from '$lib/components/ui/select';
	import type { Tables } from '$lib/types/database.types';
	import {
		fetchOfficeByUnit,
		fetchPositionByNatureOfWork,
		fetchProgrammeByOffice
	} from '$lib/utils/profileHelper';
	import { onMount } from 'svelte';
	let { data }: { data: PageData } = $props();
	const { form: profileForm } = data;
	const { profile } = data;
	const { supabase } = data;
	const { units } = data;
	const { natureOfWork } = data;
	const { employeeStatus } = data;
	let offices = $state<Tables<'office'>[]>();
	let programme = $state<Tables<'programme'>[]>();
	let positions = $state<Tables<'position'>[]>();

	const form = superForm(profileForm, {
		validators: zodClient(profileSubmitSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;
	let showProgramme = $derived($formData.nature_of_work_id === 1);
	let isLoadingOffices = $state(false);
	let isProgrammeLoading = $state(false);
	let isLoadingPositions = $state(false);
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
				fetchProgrammeByOffice($formData.office_id, supabase).then((result) => (programme = result))
			);
		}

		await Promise.all(promises);
	});
	$effect(() => {
		$inspect($formData);
	});
</script>

<div class="container mx-auto p-4">
	<Card class="mx-auto w-full max-w-2xl">
		<CardHeader>
			<CardTitle>Employee Profile</CardTitle>
			<CardDescription>Update your employee information</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/updateprofile" class="space-y-4" use:enhance>
				<div class="mb-4 flex justify-center">
					<Avatar class="h-24 w-24">
						<AvatarImage src={profile.avatar_url} alt={profile.first_name} />
						<AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
					</Avatar>
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
					<div class="space-y-2" class:sm:col-span-2={!showProgramme}>
						<Form.Field {form} name="office_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Office</Form.Label>
									<Select.Root
										type="single"
										value={$formData.office_id?.toString()}
										onValueChange={async (value) => {
											$formData.office_id = value ? parseInt(value) : null;
											if (showProgramme) {
												programme = [];
												$formData.programme_id = null;
												isProgrammeLoading = true;
												programme = await fetchProgrammeByOffice(parseInt(value), supabase);
												isProgrammeLoading = false;
											}
										}}
										disabled={!$formData.unit_id || isLoadingOffices}
									>
										<Select.Trigger
											{...props}
											class={`truncate ${!showProgramme ? 'w-full' : 'max-w-[350px]'}`}
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
										<Select.Content class={!showProgramme ? 'w-full' : 'max-w-[350px]'}>
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

					{#if showProgramme}
						<div class="space-y-2">
							<Form.Field {form} name="programme_id">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Programme</Form.Label>
										<Select.Root
											type="single"
											value={$formData.programme_id?.toString()}
											onValueChange={(value) => {
												$formData.programme_id = value ? parseInt(value) : null;
											}}
											disabled={!$formData.office_id || isProgrammeLoading}
										>
											<Select.Trigger {...props} class="max-w-[350px] truncate">
												{#if !$formData.office_id}
													Please select an office first
												{:else if isProgrammeLoading}
													Loading programmes...
												{:else if !programme || programme.length === 0}
													No programmes available for this office
												{:else if $formData.programme_id}
													{programme.find((p) => p.id === $formData.programme_id)?.name ??
														'Programme not found'}
												{:else}
													Select a programme
												{/if}
											</Select.Trigger>
											<Select.Content class="max-w-[350px]">
												{#if !$formData.office_id}
													<Select.Item value="" disabled>Please select an office first</Select.Item>
												{:else if isProgrammeLoading}
													<Select.Item value="" disabled>Loading programmes...</Select.Item>
												{:else if !programme || programme.length === 0}
													<Select.Item value="" disabled>
														No programmes available for this office
													</Select.Item>
												{:else}
													{#each programme as prog (prog.id)}
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
								<Form.Description>Select your programme.</Form.Description>
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

```

# frontend/src/routes/dashboard/profile/[profileid]/schema.ts

```ts
import { z } from 'zod';

export const profileSchema = z.object({
	avatar_url: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	email: z.string().email('Invalid email address').nullable(),
	employee_id: z.string().min(1, 'Employee ID is required').nullable(),
	employee_status_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	first_name: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.regex(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces')
		.nullable(),
	id: z.string().min(1, 'ID is required').optional(),
	last_name: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.regex(/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces')
		.nullable(),
	middle_name: z
		.string()
		.regex(/^[A-Za-z\s]*$/, 'Middle name can only contain letters and spaces')
		.nullable(),
	nature_of_work_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	office_id: z.number().int('Must be an integer').positive('Must be a positive number').nullable(),
	position_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	programme_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	unit_id: z.number().int('Must be an integer').positive('Must be a positive number').nullable(),
	updated_at: z.string().nullable().optional()
});
// Stricter schema for form submission
export const profileSubmitSchema = profileSchema.extend({
	employee_id: z.string().min(3, 'Employee ID is required'),
	first_name: z
		.string()
		.refine(
			(val) => val.length >= 2 && /^[A-Za-z\s]+$/.test(val),
			'First name must be at least 2 characters and contain only letters and spaces'
		),
	last_name: z
		.string()
		.refine(
			(val) => val.length >= 2 && /^[A-Za-z\s]+$/.test(val),
			'Last name must be at least 2 characters and contain only letters'
		),
	unit_id: z.number().positive(),
	office_id: z.number().positive()
	// Add other required fields here
});

export type ProfileSubmitSchema = typeof profileSubmitSchema;
export type ProfileSchema = typeof profileSchema;

```

# frontend/static/favicon.png

This is a binary file of the type: Image

# frontend/svelte.config.js

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;

```

# frontend/tailwind.config.ts

```ts
import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			// backgroundImage: {
			// 	'auth-bg': 'url(/authbg.svg)'
			// },
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				xl: 'calc(var(--radius) + 4px)',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' }
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate]
};

export default config;

```

# frontend/tsconfig.json

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://svelte.dev/docs/kit/configuration#alias
	// except $lib which is handled by https://svelte.dev/docs/kit/configuration#files
	//
	// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
	// from the referenced tsconfig.json - TypeScript does not merge them in
}

```

# frontend/vite.config.ts

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});

```

# README.md

```md
# EvaChain
```

# scripts.txt

```txt
source ./supabase/.env &&

npx supabase db diff --use-migra -f name_of_schema

//crea
npx supabase migration new name_of_the_action

//resets the remote database
npx supabase db reset --linked

//generate types
npx supabase gen types --lang=typescript --local > frontend/src/lib/types/database.types.ts

//generate summary
npx ai-digest -i EvaChain/ -o EvaChain/project_summary.md
```

# supabase/.branches/_current_branch

```
main
```

# supabase/.gitignore

```
# Supabase
.branches
.temp
.env

```

# supabase/.temp/cli-latest

```
v1.223.10
```

# supabase/.temp/gotrue-version

```
v2.163.2
```

# supabase/.temp/pooler-url

```
postgresql://postgres.xixattpbfetzpwecbkde:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

# supabase/.temp/postgres-version

```
15.6.1.135
```

# supabase/.temp/project-ref

```
xixattpbfetzpwecbkde
```

# supabase/.temp/rest-version

```
v12.2.3
```

# supabase/.temp/storage-version

```
v1.13.0
```

# supabase/config.toml

```toml
# A string used to distinguish different Supabase projects on the same host. Defaults to the
# working directory name when running `supabase init`.
project_id = "EvaChain"

[api]
enabled = true
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. `public` is always included.
schemas = ["public", "graphql_public"]
# Extra schemas to add to the search_path of every request. `public` is always included.
extra_search_path = ["public", "extensions"]
# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000

[api.tls]
enabled = false

[db]
# Port to use for the local database URL.
port = 54322
# Port used by db diff command to initialize the shadow database.
shadow_port = 54320
# The database major version to use. This has to be the same as your remote database's. Run `SHOW
# server_version;` on the remote database to check.
major_version = 15

[db.pooler]
enabled = false
# Port to use for the local connection pooler.
port = 54329
# Specifies when a server connection can be reused by other clients.
# Configure one of the supported pooler modes: `transaction`, `session`.
pool_mode = "transaction"
# How many server connections to allow per user/database pair.
default_pool_size = 20
# Maximum number of client connections allowed.
max_client_conn = 100

[db.seed]
# If enabled, seeds the database after migrations during a db reset.
enabled = true
# Specifies an ordered list of seed files to load during db reset.
# Supports glob patterns relative to supabase directory. For example:
# sql_paths = ['./seeds/*.sql', '../project-src/seeds/*-load-testing.sql']
sql_paths = ['./seed.sql']

[realtime]
enabled = true
# Bind realtime via either IPv4 or IPv6. (default: IPv4)
# ip_version = "IPv6"
# The maximum length in bytes of HTTP request headers. (default: 4096)
# max_header_length = 4096

[studio]
enabled = true
# Port to use for Supabase Studio.
port = 54323
# External URL of the API server that frontend connects to.
api_url = "http://127.0.0.1"
# OpenAI API Key to use for Supabase AI in the Supabase Studio.
openai_api_key = "env(OPENAI_API_KEY)"

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the web interface.
[inbucket]
enabled = true
# Port to use for the email testing server web interface.
port = 54324
# Uncomment to expose additional ports for testing user applications that send emails.
# smtp_port = 54325
# pop3_port = 54326

[storage]
enabled = true
# The maximum file size allowed (e.g. "5MB", "500KB").
file_size_limit = "50MiB"

[storage.image_transformation]
enabled = true

# Uncomment to configure local storage buckets
# [storage.buckets.images]
# public = false
# file_size_limit = "50MiB"
# allowed_mime_types = ["image/png", "image/jpeg"]
# objects_path = "./images"

[auth]
enabled = true
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://127.0.0.1:5173"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://127.0.0.1:5173"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).
jwt_expiry = 3600
# If disabled, the refresh token will never expire.
enable_refresh_token_rotation = true
# Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.
# Requires enable_refresh_token_rotation = true.
refresh_token_reuse_interval = 10
# Allow/disallow new user signups to your project.
enable_signup = true
# Allow/disallow anonymous sign-ins to your project.
enable_anonymous_sign_ins = false
# Allow/disallow testing manual linking of accounts
enable_manual_linking = false

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = false
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false
# If enabled, users will need to reauthenticate or have logged in recently to change their password.
secure_password_change = false
# Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.
max_frequency = "1s"
# Number of characters used in the email OTP.
otp_length = 6
# Number of seconds before the email OTP expires (defaults to 1 hour).
otp_expiry = 3600

# Use a production-ready SMTP server
# [auth.email.smtp]
# host = "smtp.sendgrid.net"
# port = 587
# user = "apikey"
# pass = "env(SENDGRID_API_KEY)"
# admin_email = "admin@email.com"
# sender_name = "Admin"

# Uncomment to customize email template
# [auth.email.template.invite]
# subject = "You have been invited"
# content_path = "./supabase/templates/invite.html"

[auth.sms]
# Allow/disallow new user signups via SMS to your project.
enable_signup = false
# If enabled, users need to confirm their phone number before signing in.
enable_confirmations = false
# Template for sending OTP to users
template = "Your code is {{ .Code }} ."
# Controls the minimum amount of time that must pass before sending another sms otp.
max_frequency = "5s"

# Use pre-defined map of phone number to OTP for testing.
# [auth.sms.test_otp]
# 4152127777 = "123456"

# Configure logged in session timeouts.
# [auth.sessions]
# Force log out after the specified duration.
# timebox = "24h"
# Force log out if the user has been inactive longer than the specified duration.
# inactivity_timeout = "8h"

# This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.
# [auth.hook.custom_access_token]
# enabled = true
# uri = "pg-functions://<database>/<schema>/<hook_name>"

# Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.
[auth.sms.twilio]
enabled = false
account_sid = ""
message_service_sid = ""
# DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:
auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"

[auth.mfa]
# Control how many MFA factors can be enrolled at once per user.
max_enrolled_factors = 10

# Control use of MFA via App Authenticator (TOTP)
[auth.mfa.totp]
enroll_enabled = true
verify_enabled = true

# Configure Multi-factor-authentication via Phone Messaging
# [auth.mfa.phone]
# enroll_enabled = true
# verify_enabled = true
# otp_length = 6
# template = "Your code is {{ .Code }} ."
# max_frequency = "10s"

# Configure Multi-factor-authentication via WebAuthn
# [auth.mfa.web_authn]
# enroll_enabled = true
# verify_enabled = true

# Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
# `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,
# `twitter`, `slack`, `spotify`, `workos`, `zoom`.
[auth.external.apple]
enabled = false
client_id = ""
# DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:
secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"
# Overrides the default auth redirectUrl.
redirect_uri = ""
# Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,
# or any other third-party OIDC providers.
url = ""
# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = false

[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
url = ''
skip_nonce_check = false


# Use Firebase Auth as a third-party provider alongside Supabase Auth.
[auth.third_party.firebase]
enabled = false
# project_id = "my-firebase-project"

# Use Auth0 as a third-party provider alongside Supabase Auth.
[auth.third_party.auth0]
enabled = false
# tenant = "my-auth0-tenant"
# tenant_region = "us"

# Use AWS Cognito (Amplify) as a third-party provider alongside Supabase Auth.
[auth.third_party.aws_cognito]
enabled = false
# user_pool_id = "my-user-pool-id"
# user_pool_region = "us-east-1"

[edge_runtime]
enabled = true
# Configure one of the supported request policies: `oneshot`, `per_worker`.
# Use `oneshot` for hot reload, or `per_worker` for load testing.
policy = "oneshot"
inspector_port = 8083

[analytics]
enabled = true
port = 54327
# Configure one of the supported backends: `postgres`, `bigquery`.
backend = "postgres"

# Experimental features may be deprecated any time
[experimental]
# Configures Postgres storage engine to use OrioleDB (S3)
orioledb_version = ""
# Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
s3_host = "env(S3_HOST)"
# Configures S3 bucket region, eg. us-east-1
s3_region = "env(S3_REGION)"
# Configures AWS_ACCESS_KEY_ID for S3 bucket
s3_access_key = "env(S3_ACCESS_KEY)"
# Configures AWS_SECRET_ACCESS_KEY for S3 bucket
s3_secret_key = "env(S3_SECRET_KEY)"

```

# supabase/migrations/20241116152556_create_table_unit.sql

```sql
-- Create the function for updating timestamps
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the unit table
CREATE TABLE unit (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on commonly searched columns
CREATE INDEX idx_unit_code ON unit(code);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON unit
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();


```

# supabase/migrations/20241116153626_create_table_nature_of_work.sql

```sql
-- create table
CREATE TABLE nature_of_work (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   type VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON nature_of_work
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# supabase/migrations/20241116155829_create_table_office.sql

```sql
CREATE TABLE office (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   unit_id INTEGER NOT NULL REFERENCES unit(id),
   code VARCHAR(50) NOT NULL UNIQUE,
   name VARCHAR(200) NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_office_unit_id ON office(unit_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON office
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# supabase/migrations/20241116160732_create_table_programme.sql

```sql
CREATE TABLE programme (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   unit_id INTEGER NOT NULL REFERENCES unit(id),
   office_id INTEGER NOT NULL REFERENCES office(id),
   name TEXT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys
CREATE INDEX idx_programme_unit_id ON programme(unit_id);
CREATE INDEX idx_programme_office_id ON programme(office_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON programme
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# supabase/migrations/20241116161506_create_table_position.sql

```sql
CREATE TABLE position (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   nature_of_work_id INTEGER NOT NULL REFERENCES nature_of_work(id),
   name VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_position_nature_of_work_id ON position(nature_of_work_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON position
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# supabase/migrations/20241116161733_create_table_employee_status.sql

```sql
-- create table
CREATE TABLE employee_status (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   type VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON employee_status
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# supabase/migrations/20241116162523_create_table_profile.sql

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  employee_id varchar(50) unique,
  email varchar(255) unique,
  first_name text,
  middle_name text,
  last_name text,
  avatar_url text,
  unit_id integer references unit(id),
  nature_of_work_id integer references nature_of_work(id),
  office_id integer references office(id),
  programme_id integer references programme(id),
  position_id integer references position(id),
  employee_status_id integer references employee_status(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create function to handle new user signup with Google OAuth data
create function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'given_name',
      split_part(new.raw_user_meta_data->>'full_name', ' ', 1),
      'Anonymous'
    ),
    coalesce(
      new.raw_user_meta_data->>'last_name',
      new.raw_user_meta_data->>'family_name',
      array_to_string(
        array_remove(
          string_to_array(new.raw_user_meta_data->>'full_name', ' '),
          split_part(new.raw_user_meta_data->>'full_name', ' ', 1)
        ),
        ' '
      ),
      'User'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      new.raw_user_meta_data->>'avatar',
      null
    )
  );
  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;  -- Still return the user even if profile creation fails
end;
$$;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
```

# supabase/seed.sql

```sql
-- 1. Unit Seeder
INSERT INTO public.unit (code, name) VALUES
    ('OUS', 'Office of the University Secretary'),
    ('SLUC', 'South La Union Campus'),
    ('MLUC', 'Middle La Union campus'),
    ('NLUC', 'North La Union Campus'),
    ('NARTDI', 'National Apiculture Reasearch Training and Development Institute')
ON CONFLICT (code) DO UPDATE 
    SET name = EXCLUDED.name,
        updated_at = timezone('utc'::text, now());

-- 2. Nature of Work Seeder
INSERT INTO public.nature_of_work (type) VALUES
    ('Teaching'),
    ('Non-Teaching')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());

-- 3. Office Seeder (Using a subquery to get unit_ids)
INSERT INTO public.office (unit_id, code, name) VALUES
    -- NLUC offices
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'CAS', 'College of Arts and Sciences'),
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'CVM', 'College of Veterinary Medicine'),
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'IES', 'Institute of Environmental Studies'),

    -- MLUC offices
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'COE', 'College of Engineering'),
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'CIT', 'College of Information Technology'),
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'COL', 'College of Law'),

    -- SLUC offices
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CM', 'College of Medicine'),
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CCHAMS', 'College of Community Health & Allied Medical Sciences'),
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CCS', 'College of Computer Science')
ON CONFLICT (code) DO UPDATE 
    SET name = EXCLUDED.name,
        unit_id = EXCLUDED.unit_id,
        updated_at = timezone('utc'::text, now());

-- 4. Programme Seeder (Using subqueries to get unit_ids and office_ids)
INSERT INTO public.programme (unit_id, office_id, name) VALUES
    -- SLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCS'),
     'Bachelor of Science in Computer Science'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCHAMS'),
     'Bachelor of Science in Nursing'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCHAMS'),
     'Bachelor of Science in Midwifery'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CM'),
     'Doctor of Medicine'),

    -- MLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COL'),
     'Juris Doctor'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'CIT'),
     'Master in Information Technology'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'CIT'),
     'Bachelor of Science in Information Technology'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COE'),
     'Bachelor of Science in Electrical Engineering'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COE'),
     'Bachelor of Science in Mechanical Engineering'),

    -- NLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'IES'),
     'Bachelor of Science in Environmental Science'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CVM'),
     'Doctor of Veterinary Medicine'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CAS'),
     'Bachelor of Science in Biology'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CAS'),
     'Bachelor of Science in English Language')
ON CONFLICT DO NOTHING;

-- 5. Position Seeder (Using subquery to get nature_of_work_id)
INSERT INTO public.position (nature_of_work_id, name) VALUES
    -- Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Instructor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Assistant Professor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor'),

    -- Non-Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Administrative Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Records Officer'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Library Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Laboratory Technician')
ON CONFLICT (name) DO UPDATE 
    SET nature_of_work_id = EXCLUDED.nature_of_work_id,
        updated_at = timezone('utc'::text, now());

-- 6. Employee Status Seeder
INSERT INTO public.employee_status (type) VALUES
    ('Permanent'),
    ('Contractual'),
    ('Probationary'),
    ('Temporary'),
    ('Part-Time')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());
```

