<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { username, password, isLoggedIn } from '../stores/login';
    import { onDestroy } from 'svelte';

    function handleSubmit() {
        push('/');
    }

    onDestroy(() => {
        username.set('');
        password.set('');
    });
</script>

<div class="text-center px-4">
    <h1 class="text-6xl font-mono mt-10">Welcome to Server Nexus!</h1>
    <p class="font-mono text-xl mt-10 break-words">Your one-stop location for anything Minecraft server.</p>
</div>

<form on:submit|preventDefault={handleSubmit} class="card w-96 bg-base-100 card-lg shadow-sm m-auto mt-20">
    <div class="card-body">
        <div class="text-center">
            <input bind:value={$username} type="input" class="input validator font-mono bg-base-300" required placeholder="Enter Username" minlength="4" maxlength="20" title="Username"
                pattern="[A-Za-z0-9]*" />
        </div>
        <div class="text-center mt-10">
            <input bind:value={$password} type="password" class="input validator font-mono bg-base-300" required placeholder="Enter Password" minlength="8" title="Password"
                pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-za-z0-9]).{8,}"} />
        </div>
        <div class="text-center mt-15">
            <button disabled={!$isLoggedIn} class="btn btn-xl btn-primary font-mono">Login</button>
            <p class="mt-5 font-mono text-sm">Don't have an account?
                <a class="font-mono text-sm underline" href="#/signup">Sign up!</a>
            </p>
        </div>
    </div>
</form>
