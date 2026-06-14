<script lang="ts">
    import { serverData } from '../../stores/server';
    import { serverID } from '../../stores/profiles';
    import { error } from '../../stores/server';
    import type { ServerProfile } from '../../types/serverInfo';
    import ServerPanel from '../../components/ServerInfo/ServerPanel.svelte';
    import ReviewPanel from '../../components/ServerInfo/ReviewPanel.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { supabase } from '../../supabase';
    import { cacheServerData, getCachedServerData, formatCacheAge } from '../../utils/serverCache';

    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.hash = '#/explore';
        }
    }

    export let profile: ServerProfile;
    export let serverId: string | undefined = undefined;
    let isLoading = false;
    let usingCachedData = false;
    let cacheTimestamp: number | null = null;

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
                isLoading = false;
                return;
            }

            if (data) {
                profile = data;
            } else {
                isLoading = false;
                return;
            }
        } catch (err) {
            isLoading = false;
            return;
        }

        try {
            const response = await fetch('/api/server-lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip: profile.host, port: Number(profile.port) })
            });
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

                // Server offline — try cache
                const cached = getCachedServerData(profile.host, profile.port);
                if (cached) {
                    $serverData = cached.data;
                    usingCachedData = true;
                    cacheTimestamp = cached.timestamp;
                } else {
                    $serverData = normalizedData;
                }
            } else {
                $serverData = normalizedData;
                cacheServerData(profile.host, profile.port, normalizedData);
            }

            if (!data.online && data.ip_address === null && data.srv_record === null) {
                throw new Error('Invalid server');
            }
        } catch (err) {
            const cached = getCachedServerData(profile.host, profile.port);
            if (cached) {
                $serverData = cached.data;
                usingCachedData = true;
                cacheTimestamp = cached.timestamp;
                $error = null;
            } else {
                $error = 'Failed to fetch server data.';

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
            }
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
                <a on:click={goBack} class="inline-flex w-fit hover:cursor-pointer hover:text-primary hover:scale-120 transition duration-300" aria-label="Back Button">
                    <i class="fa-arrow-left fa-solid text-xl md:text-3xl"></i>
                </a>
            </div>
            <div class="tabs tabs-lift mb-10 drop-shadow-xl/80">
                <input type="radio" name="my_tabs_3" class="tab text-md md:text-lg text-primary hover:text-primary" aria-label="Server Info" checked />
                <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-5 md:p-10">
                    {#if usingCachedData && cacheTimestamp}
                        <div class="mb-4">
                            <div class="alert alert-warning text-sm shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Showing cached data (from {formatCacheAge(cacheTimestamp)}) — server may be offline</span>
                            </div>
                        </div>
                    {/if}
                    <ServerPanel profile={profile} data={$serverData}  />
                </div>

                <input type="radio" name="my_tabs_3" class="tab text-md md:text-lg text-primary hover:text-primary" aria-label="Ratings & Reviews" />
                <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-5 md:p-10">
                    <ReviewPanel profile={profile}/>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex justify-center mx-auto px-10 max-w-3xl xl:max-w-7xl">
            <div class="flex flex-col md:flex-row gap-5 md:gap-15 items-start">
                <div class="flex justify-start">
                    <a on:click={goBack} class="inline-flex w-fit hover:cursor-pointer hover:text-primary hover:scale-120 transition duration-300" aria-label="Back Button">
                    <i class="fa-arrow-left fa-solid text-xl md:text-3xl"></i>
                    </a>
                </div>

                <div class="tabs tabs-lift mb-10 drop-shadow-xl/80">
                    <input type="radio" name="my_tabs_3" class="tab text-lg text-primary hover:text-primary" aria-label="Server Info" checked />
                    <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-10">
                        <div class="flex flex-col xl:flex-row gap-5">

                            <div class="drop-shadow-xl/80 card xl:min-w-lg h-[60vh] overflow-y-auto bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral">
                                <div class="card-body flex flex-col gap-4">
                                    <div class="stats stats-vertical bg-transparent shadow-none">
                                        {#each [0,1,2,3,4,5,6,7,8,9,10,11] as _}
                                            <div class="stat flex flex-row items-center gap-10 py-3 border-neutral/50">
                                                <div class="skeleton h-6 w-1/4 min-w-[100px]"></div>
                                                <div class="skeleton h-6 w-1/2"></div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col gap-5 w-full xl:w-auto">

                            <div class="drop-shadow-xl/80 card h-fit bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral w-full">
                                <div class="card-body flex flex-col gap-0">
                                    <div class="stats stats-vertical bg-transparent shadow-none">
                                        <div class="stat flex flex-col items-center gap-5 border-neutral/50">
                                            <div class="skeleton h-6 w-20"></div>
                                            <div class="skeleton w-16 h-16 rounded-lg"></div>
                                        </div>
                                        <div class="stat flex flex-col items-center gap-5 border-none">
                                            <div class="skeleton h-6 w-20"></div>
                                            <div class="skeleton h-5 w-full max-w-[300px]"></div>
                                            <div class="skeleton h-5 w-3/4 max-w-[300px]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="drop-shadow-xl/80 card h-fit bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral w-full">
                                <div class="card-body">
                                    <div class="stats bg-transparent shadow-none w-full">
                                        {#each [0,1,2] as _}
                                        <div class="stat flex flex-col items-center gap-5 border-neutral/50">
                                            <div class="skeleton h-4 w-12 mb-2"></div>
                                            <div class="skeleton h-5 w-24"></div>
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
