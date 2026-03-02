<script lang="ts">
    import { supabase } from '../supabase';
    import { email, username, password, canSignup } from '../stores/signup';
    import { onDestroy } from 'svelte';
    import { push } from 'svelte-spa-router';

    let showAlert = false;
    let isLoading = false;

    function openModal() {
        (document.getElementById(`signup_modal`) as HTMLDialogElement)?.showModal();
    }

    function closeModal() {
        (document.getElementById(`signup_modal`) as HTMLDialogElement)?.close();
    }

    function closeAlert() {
        showAlert = false;
        push('/login');
    }

    async function signup() {
        isLoading = true;
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
        openModal();
    }

    onDestroy(() => {
        email.set('');
        username.set('');
        password.set('');
    });
</script>

<div class="px-5 select-none" style="min-height: calc(100vh - 200px);">
    <h1 class="lg:text-5xl md:text-3xl text-2xl mt-25 md:mt-30 font-bold">Welcome to <span class="text-primary">Server Nexus</span></h1>
    <p class="text-md md:text-lg mt-10 text-stone-400">We're excited to have you here!</p>

    <form on:submit|preventDefault={signup} class="drop-shadow-xl/80 card w-96 bg-gradient-to-tr from-black to-zinc-700 card-lg m-auto mt-10 mb-10 border-1 border-neutral">
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

                <button disabled={!$canSignup} class="btn btn-primary w-full hover:scale-102 transition duration-200">
                    {#if !isLoading}
                        Sign Up
                    {:else}
                        <span class="loading loading-spinner loading-sm"></span>Signing Up...
                    {/if}
                </button>

                <p class="mt-5 text-sm">Already have an account?
                    <a class="text-sm text-primary hover:underline" href="#/login">Login!</a>
                </p>
            </div>
        </div>
    </form>
</div>

<dialog id="signup_modal" class="modal">
    <div class="modal-box flex flex-col gap-5 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
        <h3 class="text-lg font-bold">Please check your email for a confirmation link.</h3>
        <div class="flex justify-center gap-3">
            <button class="btn btn-ghost border-1 border-gray-500 hover:bg-primary hover:scale-105 transition duration-200" on:click={closeModal}>Close</button>
        </div>
    </div>
</dialog>