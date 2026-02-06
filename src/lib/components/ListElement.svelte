<script lang="ts">
    import { serverProfile } from '../stores/profiles';
    import { supabase } from '../supabase';
    import type { ServerProfile } from '../types/serverInfo';
    import { push } from 'svelte-spa-router';

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

<li class="list-row flex items-center justify-between bg-base-300">
    <div class="flex items-center gap-3">
        <img src={profile.icon} alt="Server Icon" class="max-w-10 max-h-10 sm:max-w-10 sm:max-h-10 md:max-w-15 md:max-h-15 lg:max-w-20 lg:max-h-20 select-none" />
        <div class="text-md sm:text-md md:text-lg lg:text-2xl text-left">{profile.host}</div>
    </div>

    <div class="flex items-center gap-2 sm:gap-2 md:gap-6 lg:gap-6 lg:text-2xl md:text-lg sm:text-md text-md">
        <div class="flex items-center gap-1">
            <i class="fa-star fa-solid text-orange-400"></i>
            <p class="select-none">4.3</p>
        </div>

        <a on:click={() => addFav()} class="inline-flex w-fit bg-transparent hover:cursor-pointer hover:text-primary" aria-label="Save Button">
            <i class={`fa-bookmark ${btnActive ? 'fa-solid' : 'fa-regular'}`}></i>
        </a>
        <a on:click={() => goTo()} class="inline-flex w-fit bg-transparent hover:cursor-pointer hover:text-primary" aria-label="View Button">
            <i class="fa-arrow-right fa-solid"></i>
        </a>
    </div>
</li>