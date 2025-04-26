<script lang="ts">
    import { onDestroy } from 'svelte';
    import { supabase } from '../supabase';
    import { email, username, password, canSignup } from '../stores/signup';

    let showAlert = false;

    function closeAlert() {
        showAlert = false;
    }

    async function signup() {
        const { error: signupError } = await supabase.auth.signUp({
            email: $email,
            password: $password,
            options: {
                emailRedirectTo: `${window.location.origin}/?type=signup`,
                data: {
                    username: $username
                }
            }
        });

        if (signupError) {
            console.log("Signup error occurred:", signupError.message);
            return;
        }

        showAlert = true;
    }

    onDestroy(() => {
        email.set('');
        username.set('');
        password.set('');
    });
</script>

<div class="text-center font-mono px-4">
    <h1 class="text-6xl mt-10">Welcome to Server Nexus!</h1>
    <p class="text-xl mt-10">Your one-stop location for anything Minecraft server.</p>
</div>

{#if showAlert}
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div role="alert" class="alert text-primary bg-base-200 font-mono w-[90%] sm:w-130 relative -mt-20 mx-4">
            <button class="btn btn-sm btn-circle absolute right-2 top-2" on:click={closeAlert}>✕</button>
            <span class="text-sm sm:text-base">Please check your email for the confirmation link.</span>
        </div>
    </div>
{/if}

<form on:submit|preventDefault={signup} class="card w-96 bg-base-100 card-lg shadow-sm m-auto mt-10">
    <div class="card-body text-center font-mono">
        <div>
            <input bind:value={$email} class="input validator bg-base-300" type="email" required placeholder="Enter Email"
                pattern="[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+"/>
            <p class="validator-hint hidden">
                Enter valid email address
                <br/>(i.e. bob@mail.com)
            </p>
        </div>
        <div class="mt-5">
            <input bind:value={$username} type="input" class="input validator bg-base-300" required placeholder="Create Username"
                pattern="[A-Za-z0-9]*" minlength="4" maxlength="20" title="Username" />
            <p class="validator-hint hidden">
                Username can only contain:
                <br/>4-20 characters
                <br/>Letters and numbers
            </p>
        </div>
        <div class="mt-5">
            <input bind:value={$password} type="password" class="input validator bg-base-300" required placeholder="Create Password" minlength="8"
                pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-za-z0-9]).{8,}"} title="Password" />
            <p class="validator-hint hidden">
                Password must contain:
                <br/>At least 8 characters (max. 20)
                <br/>At least 1 number (0-9)
                <br/>At least 1 lowercase letter (a-z)
                <br/>At least 1 uppercase letter (A-Z)
                <br/>At least 1 special character (i.e., !@#$%^&*)
            </p>
        </div>
        <div class="mt-5">
            <button disabled={!$canSignup} class="btn btn-xl btn-primary">Sign Up</button>
            <p class="mt-5 text-sm">Already have an account?
                <a class="text-sm text-primary" href="#/login">Login!</a>
            </p>
        </div>
    </div>
</form>
