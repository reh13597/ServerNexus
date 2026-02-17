<script lang="ts">
    import { serverData } from '../../stores/server';
    import { serverID } from '../../stores/profiles';
    import { error } from '../../stores/server';
    import type { ServerProfile } from '../../types/serverInfo';
    import Panel from '../../components/ServerPanel.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { supabase } from '../../supabase';

    export let profile: ServerProfile;
    let isLoading = false;

    onMount(async () => {
        isLoading = true;

        try {
            const { data, error } = await supabase
                .from('servers_with_stats')
                .select('id, host, port, icon, avg_rating, review_count, save_count')
                .eq('id', $serverID)
                .single();

            if (error) {
                console.error('Error fetching server data:', error);
                isLoading = false;
                return;
            }

            if (data) {
                profile = data;
            } else {
                console.error('No server data found');
                isLoading = false;
                return;
            }
        } catch (err) {
            console.error('Failed to fetch server data:', err);
            isLoading = false;
            return;
        }

        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${profile.host}:${profile.port}`);
            const data = await response.json();

            if (!data.version) {
                throw new Error();
            }

            $serverData = data;
        } catch (err) {
            $error = 'Failed to fetch server data.';
            console.log($error);

            $serverData = {
                online: false,
                host: '',
                port: 0,
                ip_address: null,
                eula_blocked: null,
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
                },
            };
        } finally {
            await new Promise(r => setTimeout(r, 200));
            isLoading = false;
        }
    });

    onDestroy(() => {
        $error = null;
        $serverData = null;
    });
</script>

<div class="relative flex justify-center mx-auto px-10 max-w-3xl sm:max-w-3xl lg:max-w-7xl">
    {#if $serverData && profile && !isLoading}
        <a href="#/explore" class="absolute -left-30 top-20 xl:top-30 inline-flex w-fit text-3xl hover:cursor-pointer hover:text-primary hover:scale-120 transition duration-200" aria-label="Back Button">
            <i class="fa-arrow-left fa-solid"></i>
        </a>
        <div class="mt-20 xl:mt-30 mb-10">
            <Panel profile={profile} data={$serverData}  />
        </div>
    {:else}
        <span class="mt-20 xl:mt-30 loading loading-spinner loading-xl scale-100 sm:scale-100 md:scale-150 lg:scale-200 text-primary"></span>
    {/if}
</div>
