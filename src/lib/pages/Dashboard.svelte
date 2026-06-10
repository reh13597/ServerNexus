<script lang="ts">
    import { onMount } from 'svelte';
    import { username, userID } from '../stores/user';
    import { supabase } from '../supabase';
    import Card from '../components/Cards/DashCard.svelte';

    let savedCount = 0;
    let reviewCount = 0;
    let memberSince = '';
    let loading = true;

    onMount(async () => {
        const id = $userID;
        if (!id) { loading = false; return; }

        const [saved, reviews, profile] = await Promise.all([
            supabase.from('saved_servers').select('*', { count: 'exact', head: true }).eq('user_id', id),
            supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', id),
            supabase.from('profiles').select('created_at').eq('id', id).single()
        ]);

        savedCount = saved.count ?? 0;
        reviewCount = reviews.count ?? 0;

        if (profile.data?.created_at) {
            const date = new Date(profile.data.created_at);
            memberSince = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

        loading = false;
    });
</script>

<div class="px-5 pb-10" style="min-height: calc(100vh - 200px);">
    <h1 class="lg:text-4xl md:text-3xl text-2xl font-bold md:mt-30 mt-25 select-none">Welcome, <span class="text-primary">{$username}</span></h1>
    <p class="mt-4 text-md md:text-lg text-stone-400 select-none">Explore everything Server Nexus has to offer.</p>

    <!-- Metrics -->
    <div class="mt-8 bg-gradient-to-tr from-black to-zinc-800 border-1 border-neutral rounded-2xl drop-shadow-xl/80 p-5 md:p-6 max-w-3xl mx-auto">
        {#if loading}
            <div class="flex justify-center py-2">
                <span class="loading loading-dots loading-sm text-primary"></span>
            </div>
        {:else}
            <div class="flex flex-col md:flex-row md:divide-x md:divide-neutral gap-4 md:gap-0">
                <div class="flex items-center gap-3 md:pr-8">
                    <i class="fa-solid fa-bookmark text-primary text-lg"></i>
                    <div class="select-none">
                        <p class="text-xl font-bold text-white">{savedCount}</p>
                        <p class="text-xs text-stone-400">Saved Servers</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 md:px-8">
                    <i class="fa-solid fa-star text-primary text-lg"></i>
                    <div class="select-none">
                        <p class="text-xl font-bold text-white">{reviewCount}</p>
                        <p class="text-xs text-stone-400">Reviews Written</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 md:pl-8">
                    <i class="fa-solid fa-calendar-days text-primary text-lg"></i>
                    <div class="select-none">
                        <p class="text-xl font-bold text-white">{memberSince || '—'}</p>
                        <p class="text-xs text-stone-400">Member Since</p>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <!-- Feature Cards -->
    <div class="flex flex-wrap justify-center gap-10 mt-16">
        <Card title="Server Status" description="Check the live status, player count, and details of any Minecraft server." path="status" />
        <Card title="Discover Servers" description="Browse through popular Minecraft servers, search for specific ones, or leave a review." path="explore" />
        <Card title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." path="profiles" />
    </div>
</div>
