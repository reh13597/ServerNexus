<script lang="ts">
    import { serverData, serverIp, serverPort, error, canFetchServerData } from '../stores/server';
    import Card from '../components/ServerStatusCard.svelte';
    import { onDestroy } from 'svelte';

    async function initServerData() {
        $error = null;
        $serverData = null;

        const response = await fetch(`https://mcapi.us/server/status?ip=${$serverIp}&port=${$serverPort}`);
        const data = await response.json();
        $serverData = data;

        if (data.players.max === 0) {
            $error = 'Failed to fetch server data.';
            return;
        }
    }

    onDestroy(() => {
        $serverIp = '';
        $serverPort = '';
        $error = null;
        $serverData = null;
    });
</script>

<div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold mt-10">Find the status of any Minecraft server!</h1>
    <form on:submit|preventDefault={initServerData} class="mt-15 flex flex-col items-center space-y-4">
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <input type="input" bind:value={$serverIp}
                required placeholder="Enter Server IP" class="input validator bg-base-300" minlength="7" maxlength="15"
                title="Server IP" pattern="[A-Za-z0-9.]+[A-Za-z0-9.]+[A-Za-z0-9.]+\.[A-Za-z0-9]+"/>
        </div>
        <div class="flex flex-col space-y-2 w-full max-w-xs mt-5">
            <input type="input" bind:value={$serverPort}
                required placeholder="Enter Server Port" class="input validator bg-base-300" maxlength="5"
                title="Server Port" pattern="[0-9]+"/>
            {#if $error}
                <p class="text-error text-xs mt-2">
                    {$error}
                    <br/>Invalid IP or port, try again.
                </p>
            {/if}
        </div>
        <button class="btn btn-primary btn-xl mt-5" disabled={!$canFetchServerData} on:click={initServerData}>Fetch Server Data</button>
    </form>
    {#if $serverData}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card title="Server Information" data={$serverData} type="info" />
            <Card title="Connection Details" data={$serverData} type="connection" customIp={$serverIp} customPort={$serverPort} />
        </div>
    {/if}
</div>
