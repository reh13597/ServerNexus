<script lang="ts">
    import { serverData, serverIp, error, canFetchServerData } from '../stores/server';
    import Card from '../components/ServerStatusCard.svelte';
    import { onDestroy } from 'svelte';

    async function initServerData() {
        $error = null;

        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${$serverIp}:25565`);
            const data = await response.json();

            if (!data.version) {
                throw new Error();
            }

            $serverData = data;
        } catch (err) {
            $error = 'Failed to fetch server data.';
            $serverData = {
                online: false,
                host: $serverIp,
                port: 0,
                ip_address: null,
                version: {
                    name_clean: '',
                    name_raw: '',
                    name_html: '',
                    protocol: 0
                },
                players: {
                    online: 0,
                    max: 0
                },
                motd: {
                    raw: '',
                    clean: '',
                    html: ''
                }
            };
        }
    }

    onDestroy(() => {
        $serverIp = '';
        $error = null;
        $serverData = null;
    });
</script>

<div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold mt-10">Find the status of any Minecraft server!</h1>
    <form on:submit|preventDefault={initServerData} class="mt-15 flex flex-col items-center space-y-4">
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <input type="input" bind:value={$serverIp}
                required placeholder="Enter Server IP" class="input validator bg-base-300" minlength="7" maxlength="30"
                title="Server IP" pattern="[A-Za-z0-9.]+[A-Za-z0-9.]+[A-Za-z0-9.]+\.[A-Za-z0-9]+"/>
        </div>
        {#if $error}
            <p class="text-error text-xs mt-2">
                {$error}
                <br/>Invalid IP, try again.
            </p>
        {/if}
        <button class="btn btn-primary btn-xl mt-5" disabled={!$canFetchServerData} on:click={initServerData}>Fetch Server Data</button>
    </form>
    {#if $serverData}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <Card title="Server Information" data={$serverData} type="info" />
            <Card title="Connection Details" data={$serverData} type="connection" customIp={$serverIp} />
            <Card title="Miscellaneous" data={$serverData} type="icon" />
        </div>
    {/if}
</div>
