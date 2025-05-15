<script lang="ts">
    import { profileServerData, profileServerIp } from '../../../stores/server';
    import { userID } from '../../../stores/login';
    import { supabase } from '../../../supabase';
    import Card from '../../../components/StatusCard.svelte';
    import { onMount } from 'svelte';

    async function getServerIp() {
        const { data: serverIp, error: serverIpError } = await supabase
            .from('servers')
            .select('ip')
            .eq('id', $userID)
            .single();

        if (serverIpError) {
            console.error('Error fetching username:', serverIpError);
        } else if (serverIp) {
            profileServerIp.set(serverIp.ip);
        }
    }

    onMount(() => {
        getServerIp();
    });
</script>

<div class="container mx-auto px-4">
    {#if $profileServerData}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 mb-10">
            <Card title="Server Information" data={$profileServerData} type="info" />
            <Card title="Connection Details" data={$profileServerData} type="connection" customIp={$profileServerIp} />
            <Card title="Miscellaneous" data={$profileServerData} type="icon" />
        </div>
    {:else}
        <h1 class="text-4xl font-bold mt-10">Server Status</h1>
    {/if}
</div>
