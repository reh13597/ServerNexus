<script lang="ts">
    import { supabase } from '../supabase';
    import { userID } from '../stores/user';
    import { email, password, canLogin, isLoggedIn, suppressAuthListener } from '../stores/login';
    import { push } from 'svelte-spa-router';
    import { onDestroy } from 'svelte';

    let loginError = false;
    let isLoading = false;

    async function login() {
        isLoading = true;
        loginError = false;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: $email,
            password: $password,
        })

        if (error) {
            loginError = true;
            email.set('');
            password.set('');
            return;
        }

        const uid = data.user?.id;

        if (!uid) {
            console.error('Login succeeded but no user ID found.');
            loginError = true;
            isLoading = false;
            return;
        }

        userID.set(uid);

        const { error: usernameError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', uid)
            .maybeSingle()

        if (usernameError) {
            console.error('Error fetching username:', usernameError);
            return;
        }

        suppressAuthListener.set(true);
        await new Promise(r => setTimeout(r, 500));
        isLoggedIn.set(true);
        suppressAuthListener.set(false);
        push('/');
        isLoading = false;
    }

    onDestroy(() => {
        email.set('');
        password.set('');
    });
</script>

<div class="px-5 select-none" style="min-height: calc(100vh - 200px);">
    <h1 class="lg:text-5xl md:text-3xl text-2xl mt-25 md:mt-30 font-bold">Welcome Back!</h1>
    <p class="text-md md:text-lg mt-10 text-stone-400">One step away from greatness...</p>

    <form on:submit|preventDefault={login} class="drop-shadow-xl/80 card w-96 bg-gradient-to-tr from-black to-zinc-700 card-lg m-auto mt-10 mb-10 border-1 border-neutral">
        <div class="card-body">
            <div>
                <label for="email" class="block text-sm font-semibold mb-3 text-left">Enter Email</label>
                <input bind:value={$email} type="input" class="input validator bg-base-300"
                    required placeholder="herobrine@nether.com" title="Username" minlength="3" maxlength="32"
                    pattern="[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+" />
            </div>
            <div class="mt-5">
                <label for="password" class="block text-sm font-semibold mb-3 text-left">Enter Password</label>
                <input bind:value={$password} type="password" class="input validator bg-base-300"
                    required placeholder="Ihatesteve123$" minlength="8" title="Password"
                    pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-za-z0-9]).{8,}"} />
                {#if loginError}
                    <p class="text-error text-xs mt-2">Invalid email or password. Try again.</p>
                {/if}
            </div>
            <div class="mt-5">
                <button disabled={!$canLogin} class="btn btn-primary w-full hover:scale-102 transition duration-200">
                    {#if isLoading && !loginError}
                        <span class="loading loading-spinner loading-sm"></span> Logging in...
                    {:else}
                        Login
                    {/if}
                </button>
                <p class="mt-5 text-sm select-none">Don't have an account yet?
                    <a class="text-sm text-primary hover:underline" href="#/signup">Sign up!</a>
                </p>
            </div>
        </div>
    </form>
</div>


