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

    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            push('/profiles');
        }
    }

    let profileUsername = '';
    let profileAvatar = '';
    let memberSince = '';
    let savedServers: ServerProfile[] = [];
    let reviews: ReviewInfo[] = [];
    let isLoading = true;

    onMount(async () => {
        isLoading = true;

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, is_public, avatar, created_at')
            .eq('id', params.userId)
            .single();

        if (profileError || !profileData || profileData.is_public !== true) {
            push('/profiles');
            return;
        }

        profileUsername = profileData.username ?? '';
        profileAvatar = profileData.avatar ?? '';
        if (profileData.created_at) {
            const date = new Date(profileData.created_at);
            memberSince = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

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

<div class="flex justify-center mt-20 md:mt-25 pb-10 mx-auto px-5 max-w-5xl">
    <div class="flex flex-col md:flex-row gap-5 md:gap-10 items-start w-full">

        <!-- Back button (matches server info page style) -->
        <div class="flex justify-start md:pt-1">
            <a
                on:click={goBack}
                class="inline-flex w-fit hover:cursor-pointer hover:text-primary hover:scale-120 transition duration-300"
                aria-label="Back to Profiles"
            >
                <i class="fa-arrow-left fa-solid text-xl md:text-3xl"></i>
            </a>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">

            <!-- Profile identity row -->
            <div class="flex items-center gap-4 mb-6 p-4 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700 rounded-box drop-shadow-xl/80">
                <div class="avatar">
                    <div class="w-12 md:w-14 rounded">
                        <img src={profileAvatar || Steve} alt="User avatar" />
                    </div>
                </div>
                <div>
                    <p class="text-lg md:text-xl font-semibold">{profileUsername}</p>
                    {#if memberSince}
                        <p class="text-xs text-stone-400 mt-1"><i class="fa-solid fa-calendar-days text-primary mr-1"></i>Member since {memberSince}</p>
                    {/if}
                </div>
            </div>

            <!-- Side-by-side lists -->
            <div class="flex flex-col md:flex-row gap-5">

                <!-- Saved Servers -->
                <div class="flex-1 min-w-0">
                    <h3 class="text-md md:text-lg font-semibold mb-3 text-left">Saved Servers</h3>
                    {#if isLoading}
                        <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box h-[45vh] space-y-4">
                            {#each [0, 1, 2, 3] as _}
                                <li class="drop-shadow-xl/80 list-row flex items-center justify-between border-1 border-neutral bg-zinc-700 p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="skeleton rounded-lg w-10 h-10"></div>
                                        <div class="skeleton h-5 w-28"></div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="skeleton h-5 w-8"></div>
                                        <div class="skeleton h-5 w-5"></div>
                                        <div class="skeleton h-5 w-5"></div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box h-[45vh] overflow-y-auto space-y-4">
                            {#if savedServers.length === 0}
                                <div class="p-4 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-sm text-left">This user hasn't saved any servers yet.</div>
                            {:else}
                                {#each savedServers as server}
                                    <ServerElement profile={server} />
                                {/each}
                            {/if}
                        </ul>
                    {/if}
                </div>

                <!-- Reviews -->
                <div class="flex-1 min-w-0">
                    <h3 class="text-md md:text-lg font-semibold mb-3 text-left">Reviews</h3>
                    {#if isLoading}
                        <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box h-[45vh] space-y-4">
                            {#each [0, 1, 2, 3] as _}
                                <li class="drop-shadow-xl/80 list-row flex flex-col border-1 border-neutral bg-zinc-700 p-4 gap-2">
                                    <div class="flex items-center gap-3">
                                        <div class="skeleton rounded w-8 h-8"></div>
                                        <div class="skeleton h-5 w-24"></div>
                                        <div class="skeleton h-5 w-10"></div>
                                    </div>
                                    <div class="skeleton h-4 w-full"></div>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box h-[45vh] overflow-y-auto space-y-4">
                            {#if reviews.length === 0}
                                <div class="p-4 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-sm text-left">This user hasn't written any reviews yet.</div>
                            {:else}
                                {#each reviews as review}
                                    <ReviewElement info={review} serverHost={review.server_host ?? ''} serverId={review.server_id} />
                                {/each}
                            {/if}
                        </ul>
                    {/if}
                </div>

            </div>
        </div>
    </div>
</div>
