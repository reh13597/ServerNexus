<script lang="ts">
    import { serverData, serverIp, serverPort, error, canFetchServerData } from '../../stores/server';
    import Card from '../../components/Cards/StatusCard.svelte';
    import { supabase } from '../../supabase';
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

<div class="container mx-auto px-5 pb-5" style="min-height: calc(100vh - 200px);">
    <h1 class="text-xl md:text-2xl lg:text-3xl font-bold mt-25 md:mt-30 select-none">Fetch the data of any Minecraft server</h1>
    <p class="mt-5 text-sm md:text-md text-stone-400">Get information like live status, player count, required version, and more.</p>
    <form on:submit|preventDefault={initServerData} class="mt-10 flex flex-col items-center space-y-4">
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <input type="input" bind:value={$serverIp}
                required placeholder="hypixel.net" class="input validator bg-base-300" minlength="7" maxlength="30"
                title="Server IP"/>
            <p class="validator-hint hidden">
                Enter a valid server IP address.
                <br/>(i.e. hypixel.net)
            </p>
        </div>
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <input type="input" bind:value={$serverPort}
                required placeholder="25565" class="input validator bg-base-300" minlength="5" maxlength="5"
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
            <button class="btn btn-primary btn-md hover:scale-110 transition duration-200" disabled={!$canFetchServerData}>
                {#if !isLoading}
                    Fetch Server Data
                {:else}
                    <span class="loading loading-spinner loading-sm"></span> Fetching...
                {/if}
            </button>
        </div>
    </form>
    {#if $serverData && !isLoading}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:mt-5 p-5" bind:this={cardsContainer}>
            <Card title="Server Information" data={$serverData} type="info" />
            <Card title="Connection Details" data={$serverData} type="connection" />
            <Card title="Miscellaneous" data={$serverData} type="icon" />
        </div>
    {:else if isLoading}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:mt-5 p-5">
            {#each ['Server Information', 'Connection Details', 'Miscellaneous'] as title}
                <div class="card card-sm w-full min-h-[372px] bg-gradient-to-tr from-black to-zinc-800 border-1 border-neutral">
                    <div class="card-body">
                        <div class="skeleton h-7 w-48 mx-auto mb-2"></div>
                        <div class="stats stats-vertical shadow">
                            {#each [0, 1, 2] as _}
                                <div class="stat flex flex-col items-center">
                                    <div class="skeleton h-6 w-24 mb-3"></div>
                                    <div class="skeleton h-5 w-32"></div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
