<script lang="ts">
    import { serverData, serverIp, serverPort, error } from '../stores/server';
    import Card from '../components/ServerStatusCard.svelte';

    async function initServerData() {
        $error = null;

        try {
            const response = await fetch(`https://mcapi.us/server/status?ip=${$serverIp}&port=${$serverPort}`);
            const data = await response.json();
            $serverData = data;
        } catch (e) {
            $error = 'Failed to fetch server data';
            console.error(e);
        }
    }
</script>

<div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold mt-10">Find the status of any server!</h1>
    <div class="mt-10 flex flex-col items-center space-y-4">
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <label class="label">
                <span class="label-text">Enter Server IP</span>
            </label>
            <input type="text" bind:value={$serverIp} placeholder="Enter server IP" class="input input-bordered w-full"/>
        </div>
        <div class="flex flex-col space-y-2 w-full max-w-xs">
            <label class="label">
                <span class="label-text">Enter Server Port</span>
            </label>
            <input type="number" bind:value={$serverPort} placeholder="Enter server port" class="input input-bordered w-full"/>
        </div>
        <button class="btn btn-primary btn-xl mt-10" on:click={initServerData}>Fetch Server Data</button>
    </div>
    {#if $error}
        <div class="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{$error}</span>
        </div>
    {/if}
    {#if $serverData}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card title="Server Information" data={$serverData} type="info" />
            <Card title="Connection Details" data={$serverData} type="connection" customIp={$serverIp} customPort={$serverPort} />
        </div>
    {/if}
</div>
