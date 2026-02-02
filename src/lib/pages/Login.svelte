<script lang="ts">
    import { supabase } from '../supabase';
    import { userID } from '../stores/user';
    import { email, password, canLogin, isLoggedIn } from '../stores/login';
    import { push } from 'svelte-spa-router';
    import { onDestroy } from 'svelte';

    let loginError = false;

    async function login() {
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
    }

    onDestroy(() => {
        email.set('');
        password.set('');
    });
</script>

<div class="px-4">
    <h1 class="text-6xl mt-10 font-bold text-primary">Welcome to Server Nexus!</h1>
    <p class="text-xl mt-10">Your one-stop location for anything Minecraft server.</p>
</div>

<form on:submit|preventDefault={login} class="card w-96 bg-base-100 card-lg m-auto mt-10">
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
            <button disabled={!$canLogin} class="btn btn-xl btn-primary">Login</button>
            <p class="mt-5 text-sm">Don't have an account?
                <a class="text-sm text-primary" href="#/signup">Sign up!</a>
            </p>
        </div>
    </div>
</form>
