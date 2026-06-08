<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../../supabase';
    import { userID, username } from '../../stores/user';
    import ServerElement from '../../components/ServerInfo/ServerElement.svelte';
    import ReviewElement from '../../components/ServerInfo/ReviewElement.svelte';
    import ProfileCard from '../../components/Profiles/ProfileCard.svelte';
    import Steve from '../../../assets/steve.jpg';
    import { fade } from 'svelte/transition';
    import type { ServerProfile } from '../../types/serverInfo';
    import type { ReviewInfo } from '../../types/reviewInfo';
    import type { PublicProfile } from '../../types/profileInfo';

    // My Profile
    let isPublic = false;
    let togglingVisibility = false;
    let visibilityToast: { text: string; type: 'success' | 'error' } | null = null;
    let savedServers: ServerProfile[] = [];
    let myReviews: ReviewInfo[] = [];

    // Public Profiles
    let publicProfiles: PublicProfile[] = [];

    // Loading states
    let loadingMyProfile = true;
    let loadingPublic = true;

    onMount(async () => {
        await Promise.all([
            loadMyProfile(),
            loadSavedServers(),
            loadMyReviews(),
            loadPublicProfiles()
        ]);
        loadingMyProfile = false;
        loadingPublic = false;
    });

    async function loadMyProfile() {
        const { data } = await supabase
            .from('profiles')
            .select('is_public')
            .eq('id', $userID)
            .single();
        if (data) isPublic = data.is_public ?? false;
    }

    async function loadSavedServers() {
        const { data } = await supabase
            .from('saved_servers_with_rating')
            .select('id, host, port, icon, avg_rating')
            .eq('user_id', $userID);
        savedServers = data ?? [];
    }

    async function loadMyReviews() {
        const { data } = await supabase
            .from('reviews')
            .select('*, servers(id, host)')
            .eq('user_id', $userID);
        if (data) {
            myReviews = (data as any[]).map(r => ({
                ...r,
                server_host: r.servers?.host ?? ''
            }));
        }
    }

    async function loadPublicProfiles() {
        const { data } = await supabase
            .from('public_profiles_with_stats')
            .select('*');
        publicProfiles = data ?? [];
    }

    async function toggleVisibility() {
        togglingVisibility = true;
        const newValue = !isPublic;
        const { error } = await supabase
            .from('profiles')
            .update({ is_public: newValue })
            .eq('id', $userID);

        if (!error) {
            isPublic = newValue;
            showVisibilityToast(`Profile set to ${newValue ? 'public' : 'private'}.`, 'success');
        } else {
            showVisibilityToast('Failed to update visibility.', 'error');
        }
        togglingVisibility = false;
    }

    function showVisibilityToast(text: string, type: 'success' | 'error') {
        visibilityToast = { text, type };
        setTimeout(() => visibilityToast = null, 3000);
    }

    function handleReviewDeleted(id: number) {
        myReviews = myReviews.filter(r => r.id !== id);
    }
</script>

<div class="px-5 pb-24">
    <div class="mt-25 md:mt-30 mb-8">
        <h1 class="text-xl md:text-2xl lg:text-3xl font-bold select-none">View your own profile and browse through others</h1>
        <p class="mt-3 text-sm md:text-md text-stone-400 select-none">See your saved servers, ratings & reviews, and check out other people's profiles.</p>
    </div>

    <div class="flex justify-center">
        <div class="tabs tabs-lift drop-shadow-xl/80 w-full max-w-4xl">

            <!-- Tab 1: My Profile -->
            <input type="radio" name="profiles_tabs" class="tab text-md md:text-lg text-primary hover:text-primary" aria-label="My Profile" checked />
            <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-5 md:p-8">

                <!-- Profile identity row -->
                <div class="flex items-center gap-4 mb-6 p-4 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700 rounded-box drop-shadow-xl/80">
                    <div class="avatar">
                        <div class="w-12 md:w-14 rounded">
                            <img src={Steve} alt="Your avatar" />
                        </div>
                    </div>
                    <p class="text-lg md:text-xl font-semibold">{$username}</p>
                    <button
                        on:click={toggleVisibility}
                        disabled={togglingVisibility}
                        class={`btn btn-sm hover:scale-105 transition duration-300 ml-auto ${isPublic ? 'btn-primary' : 'btn-ghost border-1 border-gray-500 hover:bg-primary'}`}
                    >
                        {#if togglingVisibility}
                            <span class="loading loading-spinner loading-xs"></span>
                        {/if}
                        {isPublic ? 'Public' : 'Private'}
                    </button>
                </div>

                <!-- Visibility toast -->
                {#if visibilityToast}
                    <div transition:fade={{ duration: 200 }} class={`mb-4 text-sm text-left px-1 ${visibilityToast.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {visibilityToast.text}
                    </div>
                {/if}

                <!-- Side-by-side lists -->
                <div class="flex flex-col md:flex-row gap-5">

                    <!-- Saved Servers -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-md md:text-lg font-semibold mb-3 text-left">Saved Servers</h3>
                        {#if !loadingMyProfile}
                            <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box h-[45vh] overflow-y-auto space-y-4">
                                {#if savedServers.length === 0}
                                    <div class="p-4 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-sm text-left">You haven't saved any servers yet.</div>
                                {:else}
                                    {#each savedServers as server}
                                        <ServerElement profile={server} />
                                    {/each}
                                {/if}
                            </ul>
                        {:else}
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
                        {/if}
                    </div>

                    <!-- My Reviews -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-md md:text-lg font-semibold mb-3 text-left">My Reviews</h3>
                        {#if !loadingMyProfile}
                            <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box h-[45vh] overflow-y-auto space-y-4">
                                {#if myReviews.length === 0}
                                    <div class="p-4 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-sm text-left">You haven't written any reviews yet.</div>
                                {:else}
                                    {#each myReviews as review}
                                        <ReviewElement
                                            info={review}
                                            serverHost={review.server_host ?? ''}
                                            serverId={review.server_id}
                                            onDeleted={handleReviewDeleted}
                                        />
                                    {/each}
                                {/if}
                            </ul>
                        {:else}
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
                        {/if}
                    </div>

                </div>
            </div>

            <!-- Tab 2: Public Profiles -->
            <input type="radio" name="profiles_tabs" class="tab text-md md:text-lg text-primary hover:text-primary" aria-label="Public Profiles" />
            <div class="tab-content bg-gradient-to-tr from-black to-zinc-800 p-5 md:p-8">
                {#if !loadingPublic}
                    <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box max-h-[60vh] overflow-y-auto space-y-4">
                        {#if publicProfiles.length === 0}
                            <div class="p-4 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-sm text-left">No public profiles yet.</div>
                        {:else}
                            {#each publicProfiles as profile}
                                <ProfileCard {profile} />
                            {/each}
                        {/if}
                    </ul>
                {:else}
                    <ul class="list border-1 border-neutral p-4 bg-gradient-to-tr from-black to-zinc-900 rounded-box max-h-[60vh] space-y-4">
                        {#each [0, 1, 2, 3] as _}
                            <li class="drop-shadow-xl/80 list-row flex items-center justify-between border-1 border-neutral bg-zinc-700 p-4">
                                <div class="flex items-center gap-3">
                                    <div class="skeleton rounded w-8 h-8 md:w-10 md:h-10"></div>
                                    <div class="skeleton h-6 w-24 md:w-36"></div>
                                </div>
                                <div class="flex items-center gap-3 md:gap-6">
                                    <div class="skeleton h-5 w-8"></div>
                                    <div class="skeleton h-5 w-8"></div>
                                    <div class="skeleton h-5 w-5"></div>
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>

        </div>
    </div>
</div>
