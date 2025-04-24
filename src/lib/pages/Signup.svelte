<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { email, username, password, isSignedUp } from '../stores/signup';
    import { onDestroy } from 'svelte';

    function handleSubmit() {
        push('/login');
    }

    onDestroy(() => {
        email.set('');
        username.set('');
        password.set('');
    });
</script>

<div class="text-center font-mono px-4">
    <h1 class="text-6xl mt-10">Welcome to Server Nexus!</h1>
    <p class="text-xl mt-10">We are excited to have you!</p>
</div>

<form on:submit|preventDefault={handleSubmit} class="card w-96 bg-base-100 card-lg shadow-sm m-auto mt-10">
    <div class="card-body text-center font-mono">
        <div>
            <input bind:value={$email} class="input validator bg-base-300" type="email" required placeholder="Enter Email"
                pattern="[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+"/>
            <p class="validator-hint">
                Enter valid email address
                <br/>(i.e. bob@mail.com)
            </p>
        </div>
        <div class="mt-5">
            <input bind:value={$username} type="input" class="input validator bg-base-300" required placeholder="Create Username"
                pattern="[A-Za-z0-9]*" minlength="4" maxlength="20" title="Username" />
            <p class="validator-hint">
                Username can only contain:
                <br/>4-20 characters
                <br/>Letters and numbers
            </p>
        </div>
        <div class="mt-5">
            <input bind:value={$password} type="password" class="input validator bg-base-300" required placeholder="Create Password" minlength="8"
                pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-za-z0-9]).{8,}"} title="Password" />
            <p class="validator-hint">
                Password must contain:
                <br/>At least 8 characters
                <br/>At least 1 number (0-9)
                <br/>At least 1 lowercase letter (a-z)
                <br/>At least 1 uppercase letter (A-Z)
                <br/>At least 1 special character (i.e., !@#$%^&*)
            </p>
        </div>
        <div class="mt-5">
            <button disabled={!$isSignedUp} class="btn btn-xl btn-primary">Sign Up</button>
            <p class="mt-5 text-sm">Already have an account?
                <a class="text-sm underline" href="#/login">Login!</a>
            </p>
        </div>
    </div>
</form>
