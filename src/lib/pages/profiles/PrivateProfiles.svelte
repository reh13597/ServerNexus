<script lang="ts">
    import ListElement from '../../components/ListElement.svelte';
    import { publicProfile, profileServerIp, profileServerPort, profileError, profileCanFetchServerData, profileServerData, serverID } from '../../stores/server';
    import { privateProfiles } from '../../stores/profiles';
    import { userID } from '../../stores/login';
    import { username } from '../../stores/username';
    import { onDestroy, onMount } from 'svelte';
    import { supabase } from '../../supabase';

    $privateProfiles = true;
    let showAlert = false;
    let servers: { id:string; owner_id: string; owner: string; ip: string; port: number; };


    function isPublicProfile() {
        $publicProfile = !$publicProfile;
    }

    function closeAlert() {
        showAlert = false;
    }

    async function initServerData() {
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
            const { data, error: serverError } = await supabase
                .from('servers')
                .insert({ owner_id: $userID, owner: $username, ip: $profileServerIp, port: $profileServerPort, public: $publicProfile})

            if (serverError) {
                console.error('Error inserting profile:', serverError.message, serverError.details);
                $profileError = 'Server profile already exists.';
                return;
            } else {
                console.log('Server added:', data);
            }
/*
            const { data: serverId, error: serverIdError } = await supabase
            .from('servers')
            .select('id')
            .eq('owner_id', $userID)
            .single();

            if (serverIdError) {
                console.error('Error fetching server id:', serverIdError);
                return;
            } else if (serverId) {
                serverID.set(serverId.id);
                console.log(serverID);
            } */

            showAlert = true;

            $profileServerIp = '';
            $profileServerData = null;
            $publicProfile = false;
        }
    }

    onMount(async () => {
      const { data, error} = await supabase
        .from('servers')
        .select('*')
        .eq('public', false);

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        servers = data;
      }
    });

    onDestroy(() => {
        $profileServerIp = '';
        $profileError = null;
        $publicProfile = false;
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
    <h1 class="text-4xl font-bold mt-10">Create and view your own server profiles!</h1>
</div>

<form on:submit|preventDefault={initServerData} class="mt-15 flex flex-col items-center space-y-4">
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
            <ListElement number={index + 1} username={server.owner} host={server.ip} />
        {/each}
    </ul>
</div>
