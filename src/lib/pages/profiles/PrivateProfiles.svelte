<script lang="ts">
    import ListElement from '../../components/ListElement.svelte';
    import { profileServerIp, profileServerPort, profileError, profileCanFetchServerData, profileServerData } from '../../stores/server';
    import { privateProfiles } from '../../stores/profiles';
    import { onDestroy } from 'svelte';

    $privateProfiles = true;

    async function createProfile() {

    }

    onDestroy(() => {
        $profileServerIp = '';
        $profileError = null;
        $profileServerData = null;
    });
</script>

<div>
    <h1 class="text-4xl font-bold mt-10">Create and view your own server profiles!</h1>
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
    <button class="btn btn-primary btn-xl mt-5" disabled={!$profileCanFetchServerData} on:click={createProfile}>Create Profile</button>
    <p class="text-sm mt-5">
        You must have the following plugins installed on your server to create a profile:
        <br/><span class="text-primary">Server Chat Plugin, Player Stats Plugin, Square Map</span>
    </p>
</form>

<div class="max-w-2xl mx-auto mt-10">
    <ul class="list bg-base-100 rounded-box shadow-md max-h-[60vh] overflow-y-auto">
        <ListElement number=1 username="reh13597" host="hypixel.net" />
        <ListElement number=2 username="reh13597" host="stray.gg" />
        <ListElement number=3 username="reh13597" host="minehut.gg" />
    </ul>
</div>
