<script lang="ts">
    import { serverData } from '../../stores/server';
    import { serverID } from '../../stores/profiles';
    import { error } from '../../stores/server';
    import type { ServerProfile } from '../../types/serverInfo';
    import ServerPanel from '../../components/ServerPanel.svelte';
    import ReviewPanel from '../../components/ReviewPanel.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { supabase } from '../../supabase';

    export let profile: ServerProfile;
    export let serverId: string | undefined = undefined;
    let isLoading = false;

    onMount(async () => {
        isLoading = true;

        if (!$serverID) {
            if (serverId) {
                $serverID = parseInt(serverId, 10);
            } else {
                const hash = window.location.hash;
                const pathMatch = hash.match(/\/server-info\/(\d+)/) || window.location.pathname.match(/\/server-info\/(\d+)/);
                if (pathMatch && pathMatch[1]) {
                    $serverID = parseInt(pathMatch[1], 10);
                }
            }
        }

        if (!$serverID) {
            console.error('No server ID found');
            isLoading = false;
            return;
        }

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
            const data: any = await response.json();

            let normalizedData: any = data;

            if (data && data.online === false) {
                normalizedData = {
                    online: false,
                    host: '',
                    port: 0,
                    ip_address: null,
                    icon: null,
                    eula_blocked: null,
                    software: null,
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

            if (!data.online && data.ip_address === null && data.srv_record === null) {
                throw new Error('Invalid server');
            }

            $serverData = normalizedData;
        } catch (err) {
            $error = 'Failed to fetch server data.';
            console.log($error);

            $serverData = {
                online: false,
                host: '',
                port: 0,
                ip_address: null,
                icon: null,
                eula_blocked: null,
                software: null,
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
    });

    onDestroy(() => {
        $error = null;
        $serverData = null;
    });
</script>

<div class="flex justify-center mt-20 md:mt-25 xl:mt-30 pb-10 mx-auto px-10 max-w-3xl xl:max-w-7xl pb-5">
    {#if $serverData && profile && !isLoading}
        <div class="flex flex-col md:flex-row gap-5 md:gap-15 items-start">
            <div class="flex justify-start">
                <a href="#/explore" class="inline-flex w-fit hover:cursor-pointer hover:text-primary hover:scale-120 transition duration-200" aria-label="Back Button">
                    <i class="fa-arrow-left fa-solid text-xl md:text-3xl"></i>
                </a>
            </div>
            <div class="tabs tabs-lift mb-10 drop-shadow-xl/80">
                <input type="radio" name="my_tabs_3" class="tab text-lg text-primary hover:text-primary" aria-label="Server Info" checked />
                <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-10">
                    <ServerPanel profile={profile} data={$serverData}  />
                </div>

                <input type="radio" name="my_tabs_3" class="tab text-lg text-primary hover:text-primary" aria-label="Ratings & Reviews" />
                <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-10">
                    <ReviewPanel profile={profile}/>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex justify-center mx-auto px-10 max-w-3xl xl:max-w-7xl">
            <div class="flex flex-col md:flex-row gap-5 md:gap-15 items-start">
                <div class="flex justify-start">
                    <a href="#/explore" class="inline-flex w-fit hover:cursor-pointer hover:text-primary hover:scale-120 transition duration-200" aria-label="Back Button">
                    <i class="fa-arrow-left fa-solid text-xl md:text-3xl"></i>
                    </a>
                </div>

                <div class="tabs tabs-lift mb-10 drop-shadow-xl/80">
                    <input type="radio" name="my_tabs_3" class="tab text-lg text-primary hover:text-primary" aria-label="Server Info" checked />
                    <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-10">
                        <div class="flex flex-col xl:flex-row gap-5">

                            <div class="drop-shadow-xl/80 card xl:min-w-lg h-[60vh] overflow-y-auto bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral">
                                <div class="card-body flex flex-col gap-4">
                                    <div class="stats stats-vertical">
                                        {#each [0,1,2,3,4,5,6,7,8,9,10, 11] as _}
                                            <div class="stat flex flex-row items-center gap-10 py-2">
                                                <div class="skeleton h-7 min-w-30 w-30"></div>
                                                <div class="skeleton h-7 w-32"></div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col justify-between gap-5">

                            <div class="drop-shadow-xl/80 card bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral">
                                <div class="card-body flex flex-col gap-0">
                                    <div class="stats stats-vertical">
                                        <div class="stat flex flex-col items-center gap-5">
                                            <div class="skeleton h-5 w-18"></div>
                                            <div class="skeleton w-18 h-16 rounded-lg"></div>
                                        </div>
                                        <div class="stat flex flex-col items-center gap-5">
                                            <div class="skeleton h-5 w-18"></div>
                                            <div class="skeleton h-5 w-52"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="drop-shadow-xl/80 card bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral">
                                <div class="card-body">
                                    <div class="stats">
                                        {#each [0,1,2] as _}
                                        <div class="stat flex flex-col items-center gap-5">
                                            <div class="skeleton h-5 w-24"></div>
                                            <div class="skeleton h-5 w-12"></div>
                                        </div>
                                        {/each}
                                    </div>
                                </div>
                            </div>

                            </div>
                        </div>
                    </div>

                    <input type="radio" name="my_tabs_3" class="tab text-lg text-primary hover:text-primary" aria-label="Ratings & Reviews" />
                    <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-10"></div>
                </div>
            </div>
        </div>
    {/if}
</div>
