<script lang="ts">
    import { supabase } from '../supabase';
    import { email, username, password, canSignup } from '../stores/signup';
    import { onDestroy } from 'svelte';
    import { push } from 'svelte-spa-router';

    let showAlert = false;
    let isLoading = false;

    function closeAlert() {
        showAlert = false;
        push('/login');
    }

    async function signup() {
        const { error } = await supabase.auth.signUp({
            email: $email,
            password: $password,
            options: {
                emailRedirectTo: `${window.location.origin}/?type=signup`,
                data: {
                    username: $username
                }
            }
        });

        if (error) {
            console.log("Signup error occurred:", error);
            return;
        }

        isLoading = false;
        showAlert = true;
    }

    onDestroy(() => {
        email.set('');
        username.set('');
        password.set('');
    });
</script>

<div class="px-4">
    <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl mt-20 lg:mt-30 font-bold">Welcome to <span class="text-primary">Server Nexus</span></h1>
    <p class="text-lg md:text-xl mt-10 text-stone-400">We're excited to have you here!</p>

    <form on:submit|preventDefault={signup} class="card w-96 bg-gradient-to-tr from-black to-zinc-700 card-lg m-auto mt-10 mb-10">
        <div class="card-body">
            <div>
                <input bind:value={$email} class="input validator bg-base-300" type="email" required placeholder="Enter Email"
                    pattern="[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+"/>
                <p class="validator-hint hidden">
                    Enter valid email address
                    <br/>(i.e. bob@mail.com)
                </p>
            </div>
            <div class="mt-5">
                <input bind:value={$username} type="input" class="input validator bg-base-300"
                    required placeholder="Create Username" minlength="4" maxlength="20"
                    title="Username" pattern="[A-Za-z0-9]*" />
                <p class="validator-hint hidden">
                    Username can only contain:
                    <br/>4-20 characters
                    <br/>Letters and numbers
                </p>
            </div>
            <div class="mt-5">
                <input bind:value={$password} type="password" class="input validator bg-base-300"
                    required placeholder="Create Password" minlength="8" maxlength="20" title="Password"
                    pattern={"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-za-z0-9]).{8,}"} />
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
                {#if !isLoading}
                    <button disabled={!$canSignup} class="btn btn-md btn-primary hover:scale-110 transition duration-200">Sign Up</button>
                {:else}
                    <span class="loading loading-spinner loading-xl scale-100 text-primary"></span>
                {/if}
                <p class="mt-5 text-sm">Already have an account?
                    <a class="text-sm text-primary hover:underline" href="#/login">Login!</a>
                </p>
            </div>
        </div>
    </form>
</div>

{#if showAlert}
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div role="alert" class="alert text-primary bg-base-200 w-[90%] sm:w-130 relative -mt-20 mx-4">
            <button class="btn btn-sm btn-circle absolute right-2 top-2" on:click={closeAlert}>✕</button>
            <span class="text-sm sm:text-base">Please check your email for the confirmation link.</span>
        </div>
    </div>
{/if}
