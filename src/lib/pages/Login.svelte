<script lang="ts">
    import { supabase } from '../supabase';
    import { userID } from '../stores/user';
    import { email, password, canLogin, isLoggedIn } from '../stores/login';
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

        isLoggedIn.set(true);
        push('/');
        await new Promise(r => setTimeout(r, 1000));
        isLoading = false;
    }

    onDestroy(() => {
        email.set('');
        password.set('');
    });
</script>

<div class="px-5 select-none">
    <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl mt-25 md:mt-30 font-bold">Welcome Back!</h1>
    <p class="text-lg md:text-xl mt-10 text-stone-400">One step away from greatness...</p>

    <form on:submit|preventDefault={login} class="card w-96 bg-gradient-to-tr from-black to-zinc-700 card-lg m-auto mt-10">
        <div class="card-body">
            <div>
                <input bind:value={$email} type="input" class="input validator bg-base-300"
                    required placeholder="Enter Email" title="Username" minlength="3" maxlength="32"
                    pattern="[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+" />
            </div>
            <div class="mt-5">
                <input bind:value={$password} type="password" class="input validator bg-base-300"
                    required placeholder="Enter Password" minlength="8" title="Password"
                    pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-za-z0-9]).{8,}"} />
                {#if loginError}
                    <p class="text-error text-xs mt-2">Invalid email or password. Try again.</p>
                {/if}
                </div>
            <div class="mt-5">
                {#if !isLoading}
                    <button disabled={!$canLogin} class="btn btn-md btn-primary hover:scale-110 transition duration-200">Login</button>
                {:else}
                    <span class="loading loading-spinner loading-xl scale-100 text-primary"></span>
                {/if}
                <p class="mt-5 text-sm select-none">Don't have an account yet?
                    <a class="text-sm text-primary hover:underline" href="#/signup">Sign up!</a>
                </p>
            </div>
        </div>
    </form>
</div>


