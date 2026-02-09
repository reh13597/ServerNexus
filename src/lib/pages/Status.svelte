<script lang="ts">
    import { serverData, serverIp, serverPort, error, canFetchServerData } from '../stores/server';
    import Card from '../components/Cards/StatusCard.svelte';
    import { supabase } from '../supabase';
    import { onDestroy } from 'svelte';

    let isLoading = false;

    async function initServerData() {
        isLoading = true;
        $error = null;

        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${$serverIp}:${$serverPort}`);
            const data = await response.json();

            if (!data.version) {
                throw new Error();
            }

            $serverData = data;

            const iconUrl = $serverData?.icon ?? null;

            const { error: serverError } = await supabase
                .from('servers')
                .upsert(
                    [{
                        host: $serverIp,
                        port: $serverPort,
                        icon: iconUrl
                    }],
                    { onConflict: 'host, port', ignoreDuplicates: true }
                );

            if (serverError) {
                console.error('Error inserting server:', serverError);
                return;
            }
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
        } finally {
            await new Promise(r => setTimeout(r, 200));
            isLoading = false;
        }
    }

    onDestroy(() => {
        $serverIp = '';
        $error = null;
        $serverData = null;
    });
</script>

<div class="container mx-auto px-4">
    <h1 class="text-xl lg:text-4xl md:text-3xl sm:text-xl font-bold mt-30 select-none">Check the status of any Minecraft server!</h1>
    <form on:submit|preventDefault={initServerData} class="mt-10 flex flex-col items-center space-y-4">
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <input type="input" bind:value={$serverIp}
                required placeholder="Enter Server IP" class="input validator bg-base-300" minlength="7" maxlength="30"
                title="Server IP"/>
            <p class="validator-hint hidden">
                Enter a valid server IP address.
                <br/>(i.e. hypixel.net)
            </p>
        </div>
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <input type="input" bind:value={$serverPort}
                required placeholder="Enter Server Port (Default: 25565)" class="input validator bg-base-300" minlength="5" maxlength="5"
                title="Server Port" pattern="[0-9]+"/>
            <p class="validator-hint hidden">
                Enter a valid server port number.
                <br/>(i.e. 25565)
            </p>
        </div>
        {#if $error}
            <p class="text-error text-xs">
                {$error}
                <br/>Invalid IP or Port, try again.
            </p>
        {/if}
        <div class="flex flex-col items-center gap-5">
            {#if !isLoading}
                <button class="btn btn-primary btn-xl" disabled={!$canFetchServerData}>Fetch Server Data</button>
            {:else}
                <span class="loading loading-spinner loading-xl scale-150 text-primary"></span>
            {/if}
        </div>
    </form>
    {#if $serverData && !isLoading}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10 sm:pb-10 pb-10 p-5">
            <Card title="Server Information" data={$serverData} type="info" />
            <Card title="Connection Details" data={$serverData} type="connection" />
            <Card title="Miscellaneous" data={$serverData} type="icon" />
        </div>
    {/if}
</div>
