<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { email, password, isLoggedIn, isValid } from '../stores/login';
    import { onDestroy } from 'svelte';

    function handleSubmit() {
        push('/');
        isValid.set(true);
    }

    onDestroy(() => {
        email.set('');
        password.set('');
    });
</script>

<div class="text-center font-mono px-4">
    <h1 class="text-6xl mt-10">Welcome to Server Nexus!</h1>
    <p class="text-xl mt-10 break-words">Your one-stop location for anything Minecraft server.</p>
</div>

<form on:submit|preventDefault={handleSubmit} class="card w-96 bg-base-100 card-lg shadow-sm m-auto mt-20">
    <div class="card-body text-center font-mono">
        <div>
            <input bind:value={$email} type="input" class="input validator bg-base-300" required placeholder="Enter Email" minlength="4" maxlength="20" title="Username"
                pattern="[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+" />
        </div>
        <div class="mt-10">
            <input bind:value={$password} type="password" class="input validator bg-base-300" required placeholder="Enter Password" minlength="8" title="Password"
                pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-za-z0-9]).{8,}"} />
        </div>
        <div class="mt-15">
            <button disabled={!$isLoggedIn} class="btn btn-xl btn-primary">Login</button>
            <p class="mt-5 text-sm">Don't have an account?
                <a class="text-sm underline" href="#/signup">Sign up!</a>
            </p>
        </div>
    </div>
</form>
