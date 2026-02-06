<script lang="ts">
    import ListElement from '../components/ListElement.svelte';
    import { profileServerIp, profileServerPort, profileError, profileCanFetchServerData, profileServerData } from '../stores/server';
    import { privateProfiles, publicProfile, serverProfiles } from '../stores/profiles';
    import { username, userID } from '../stores/user';
    import { supabase } from '../supabase';
    import { onDestroy, onMount } from 'svelte';

    $privateProfiles = true;
    let showAlert = false;
    let servers = [];

    function isPublicProfile() {
        $publicProfile = !$publicProfile;
    }

    function closeAlert() {
        showAlert = false;
    }

    async function createProfile() {
        $profileError = null;

        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${$profileServerIp}:${$profileServerPort}`);
            const data = await response.json();

            if (!data.version) {
                throw new Error();
            }

            $profileServerData = data;
        } catch (err) {
            $profileServerIp = '';
            $profileServerData = null;
            $publicProfile = false;
            $profileError = 'Failed to fetch server data.';
        }

        if (!$profileError) {
            const { error: serverError } = await supabase
                .from('servers')
                .insert({ owner_id: $userID, owner: $username, ip: $profileServerIp, port: $profileServerPort, public: $publicProfile})

            if (serverError) {
                console.error('Error inserting profile:', serverError);
                $profileError = 'Server profile already exists.';
                return;
            }

            showAlert = true;
            $profileServerIp = '';
            $profileServerData = null;
            $publicProfile = false;
        }
    }

    const unsubscribe = serverProfiles.subscribe((data) => {
        servers = data;
    });

    onMount(() => {
        serverProfiles.fetchAndSubscribe();
    });

    onDestroy(() => {
        $profileServerIp = '';
        $profileError = null;
        $publicProfile = false;

        serverProfiles.unsubscribe();
        unsubscribe();
    });
</script>

{#if showAlert}
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div role="alert" class="alert text-primary bg-base-200 w-[90%] sm:w-120 relative -mt-20 mx-4">
            <button class="btn btn-sm btn-circle absolute right-2 top-2" on:click={closeAlert}>✕</button>
            <span class="text-sm sm:text-base">Server profile successfully created and added.</span>
        </div>
    </div>
{/if}

<div>
    <h1 class="text-4xl font-bold mt-30 text-primary">Create and view your own server profiles!</h1>
</div>

<form on:submit|preventDefault={createProfile} class="mt-15 flex flex-col items-center space-y-4">
    <div class="flex flex-col space-y-2 w-full max-w-xs">
        <input type="input" bind:value={$profileServerIp}
            required placeholder="Enter Server IP" class="input validator bg-base-300" minlength="7" maxlength="30"
            title="Server IP" pattern="[A-Za-z0-9.]+[A-Za-z0-9.]+[A-Za-z0-9.]+\.[A-Za-z0-9]+"/>
    </div>
    <div class="flex flex-col space-y-2 w-full max-w-xs">
        <input type="input" bind:value={$profileServerPort}
            required placeholder="Enter Server Port" class="input validator bg-base-300" minlength="5" maxlength="5"
            title="Server Port" pattern="[0-9]+"/>
    </div>
    {#if $profileError}
        <p class="text-error text-xs mt-2">
            {$profileError}
            <br/>Invalid IP or Port, try again.
        </p>
    {/if}
    <fieldset class="fieldset bg-base-300 border-base-300 rounded-box border p-4">
        <label class="label justify-center">
            <input on:click={isPublicProfile} checked={$publicProfile} type="checkbox" class="checkbox checkbox-primary" />
            Public Profile?
        </label>
    </fieldset>
    <button class="btn btn-primary btn-xl mt-5" disabled={!$profileCanFetchServerData}>Create Profile</button>
    <p class="text-sm mt-5">
        You must have the following plugins installed on your server to create a profile:
        <br/><span class="text-primary">Server Chat Plugin, Player Stats Plugin, Square Map</span>
    </p>
</form>

<div class="max-w-2xl mx-auto mt-10">
    <ul class="list bg-base-100 rounded-box shadow-md max-h-[60vh] overflow-y-auto">
        {#each servers as server, index}
            <ListElement profile={server} number={index + 1} />
        {/each}
    </ul>
</div>
