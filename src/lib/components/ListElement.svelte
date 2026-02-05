<script lang="ts">
    import { privateProfiles, serverProfile } from '../stores/profiles';
    import { supabase } from '../supabase';
    import type { ServerProfile } from '../types/serverInfo';
    import { push } from 'svelte-spa-router';

    export let number: number;
    export let profile: ServerProfile;
    let btnActive = false;
    let showAlert = false;

    function goTo() {
        $serverProfile = profile;
        push(`/${profile.id}/profile-status`);
    }

    function openAlert() {
        showAlert = true;
    }

    function closeAlert() {
        showAlert = false;
    }

    async function addFav() {
        btnActive = !btnActive;

        const { error } = await supabase
            .from('servers')
            .update({ favourited: btnActive })
            .eq('id', profile.id)

        if (error) {
            console.error('Error inserting profile:', error);
            return;
        }
    }

    async function delProfile() {
        closeAlert();

        const { error: delProfileError } = await supabase
            .from('servers')
            .delete()
            .eq('id', profile.id)

        if (delProfileError) {
            console.error('Error deleting profile:', delProfileError);
        } else {
            console.log('Success!');
        }
    }
</script>

{#if showAlert}
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm grid grid-rows-2 items-center justify-center z-50">
        <div role="alert" class="alert text-primary bg-base-200 w-[90%] sm:w-90 relative mt-90 mx-4">
            <span class="text-sm sm:text-base text-center">Are you sure you want to delete it? This action cannot be undone.</span>
        </div>
        <div class="grid grid-cols-2 w-[90%] gap-11 -mt-100 mx-4">
            <button class="btn w-[40%] sm:w-40" on:click={() => delProfile()}>Yes</button>
            <button class="btn w-[40%] sm:w-40" on:click={() => closeAlert()}>No</button>
        </div>
    </div>
{/if}

<li class="list-row">
    <div class="text-xl text-left mt-2">{number}.</div>
    <div class="text-xl font-bold text-left mt-2">{profile.host}</div>

    <button on:click={() => addFav()} class={`btn ${btnActive ? 'btn btn-primary btn-square' : 'btn btn-primary btn-square btn-ghost'}`}>
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.4 7.4-6-4.6-6 4.6 2.4-7.4-6-4.6h7.6z"></path></g></svg>
    </button>
    <button on:click={() => goTo()} class="btn btn-primary btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M9 5l7 7-7 7"></path></g></svg>
    </button>
</li>