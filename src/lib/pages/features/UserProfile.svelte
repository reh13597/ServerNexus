<script lang="ts">
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import { supabase } from '../../supabase';
    import ServerElement from '../../components/ServerInfo/ServerElement.svelte';
    import ReviewElement from '../../components/ServerInfo/ReviewElement.svelte';
    import Steve from '../../../assets/steve.jpg';
    import type { ServerProfile } from '../../types/serverInfo';
    import type { ReviewInfo } from '../../types/reviewInfo';

    export let params: { userId: string };

    let profileUsername = '';
    let savedServers: ServerProfile[] = [];
    let reviews: ReviewInfo[] = [];
    let isLoading = true;

    onMount(async () => {
        isLoading = true;

        // Fetch profile and check visibility
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, is_public')
            .eq('id', params.userId)
            .single();

        if (profileError || !profileData || profileData.is_public !== true) {
            push('/profiles');
            return;
        }

        profileUsername = profileData.username ?? '';

        // Fetch saved servers and reviews in parallel
        const [serversResult, reviewsResult] = await Promise.all([
            supabase
                .from('saved_servers_with_rating')
                .select('id, host, port, icon, avg_rating')
                .eq('user_id', params.userId),
            supabase
                .from('reviews')
                .select('*, servers(id, host)')
                .eq('user_id', params.userId)
        ]);

        if (!serversResult.error) {
            savedServers = (serversResult.data ?? []) as ServerProfile[];
        }

        if (!reviewsResult.error && reviewsResult.data) {
            const rawData = reviewsResult.data as any[];
            reviews = rawData.map(r => ({
                ...r,
                server_host: r.servers?.host ?? ''
            }));
        }

        isLoading = false;
    });
</script>

<div class="px-5 pb-12">
    <button
        on:click={() => push('/profiles')}
        class="btn btn-ghost border-1 border-gray-500 hover:bg-primary hover:scale-105 transition duration-300 mt-25 md:mt-30"
    >
        <i class="fa-solid fa-arrow-left mr-2"></i>Back
    </button>

    <div class="max-w-3xl mx-auto mt-8 flex items-center gap-4">
        <div class="avatar">
            <div class="w-12 md:w-16 rounded">
                <img src={Steve} alt="User avatar" />
            </div>
        </div>
        <p class="text-2xl md:text-3xl font-bold">{profileUsername}</p>
    </div>

    <div class="max-w-3xl mx-auto">
        <h2 class="text-lg md:text-xl font-bold mt-8 mb-3 text-left">Saved Servers</h2>

        {#if isLoading}
            <ul class="drop-shadow-xl/80 list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box max-h-72 space-y-5">
                {#each [0, 1, 2, 3] as _}
                    <li class="drop-shadow-xl/80 list-row flex items-center justify-between border-1 border-neutral bg-zinc-700 p-4">
                        <div class="flex items-center gap-3">
                            <div class="skeleton rounded-lg w-10 h-10 md:w-12 md:h-12"></div>
                            <div class="skeleton h-6 w-24 md:w-48"></div>
                        </div>
                        <div class="flex items-center gap-2 sm:gap-2 md:gap-6 lg:gap-6">
                            <div class="skeleton h-5 w-8 md:w-12"></div>
                            <div class="skeleton h-5 w-5"></div>
                            <div class="skeleton h-5 w-5"></div>
                        </div>
                    </li>
                {/each}
            </ul>
        {:else}
            <ul class="drop-shadow-xl/80 list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box max-h-72 overflow-y-auto space-y-5">
                {#if savedServers.length === 0}
                    <div class="p-5 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-md text-left">This user hasn't saved any servers yet.</div>
                {:else}
                    {#each savedServers as server}
                        <ServerElement profile={server} />
                    {/each}
                {/if}
            </ul>
        {/if}

        <h2 class="text-lg md:text-xl font-bold mt-8 mb-3 text-left">Reviews</h2>

        {#if isLoading}
            <ul class="drop-shadow-xl/80 list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box max-h-72 space-y-5">
                {#each [0, 1, 2, 3] as _}
                    <li class="drop-shadow-xl/80 list-row flex items-center justify-between border-1 border-neutral bg-zinc-700 p-4">
                        <div class="flex items-center gap-3">
                            <div class="skeleton rounded-lg w-10 h-10 md:w-12 md:h-12"></div>
                            <div class="skeleton h-6 w-24 md:w-48"></div>
                        </div>
                        <div class="flex items-center gap-2 sm:gap-2 md:gap-6 lg:gap-6">
                            <div class="skeleton h-5 w-8 md:w-12"></div>
                            <div class="skeleton h-5 w-5"></div>
                            <div class="skeleton h-5 w-5"></div>
                        </div>
                    </li>
                {/each}
            </ul>
        {:else}
            <ul class="drop-shadow-xl/80 list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box max-h-72 overflow-y-auto space-y-5">
                {#if reviews.length === 0}
                    <div class="p-5 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-md text-left">This user hasn't written any reviews yet.</div>
                {:else}
                    {#each reviews as review}
                        <ReviewElement info={review} serverHost={review.server_host ?? ''} serverId={review.server_id} />
                    {/each}
                {/if}
            </ul>
        {/if}
    </div>
</div>
