<script lang="ts">
    import { serverData } from '../stores/server';
    import { onProfile, serverProfile } from "../stores/profiles";
    import Card from '../components/Cards/StatusCard.svelte';
    import { onDestroy, onMount } from 'svelte';

    $onProfile = true;
    let profile = $serverProfile;

    onMount(async () => {
        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${profile.ip}:${profile.port}`);
            const data = await response.json();

            if (!data.version) {
                throw new Error();
            }

            $serverData = data;
        } catch (err) {
            $serverData = {
                online: false,
                host: profile.ip,
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
    });

    onDestroy(() => {
        $serverData = null;
    });
</script>

<div class="container mx-auto px-4">
    {#if $serverData}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 mb-10">
            <Card title="Server Information" data={$serverData} type="info" />
            <Card title="Connection Details" data={$serverData} type="connection" customIp={profile.ip} />
            <Card title="Miscellaneous" data={$serverData} type="icon" />
        </div>
    {:else}
        <h1 class="text-4xl font-bold mt-10">Server Status</h1>
    {/if}
</div>
