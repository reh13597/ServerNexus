<script lang="ts">
    import { onMount } from 'svelte';
    import { username, userID } from '../stores/user';
    import { supabase } from '../supabase';
    import Card from '../components/Cards/HomeCard.svelte';

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

<div class="px-5 pb-10 space-y-20" style="min-height: calc(100vh - 200px);">
    <div>
        <h1 class="lg:text-4xl md:text-3xl text-2xl font-bold md:mt-30 mt-25 select-none">Welcome, <span class="text-primary">{$username}</span></h1>
        <p class="mt-4 text-md md:text-lg text-stone-400 select-none">Explore everything Server Nexus has to offer.</p>
    </div>


    <!-- Metrics -->
    <div class="mt-15 bg-gradient-to-tr from-black to-zinc-800 border-1 border-neutral rounded-2xl drop-shadow-xl/80 p-5 md:p-6 max-w-3xl mx-auto hover:border-primary transition-colors cursor-pointer hover:drop-shadow-primary/40">
        {#if loading}
            <div class="flex justify-center py-2">
                <span class="loading loading-dots loading-sm text-primary"></span>
            </div>
        {:else}
            <div class="flex flex-col md:flex-row md:divide-x md:divide-neutral gap-4 md:gap-0">
                <div class="flex-1 flex flex-col items-center gap-2 select-none md:px-8">
                    <p class="text-xs text-stone-400">Saved Servers</p>
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-bookmark text-primary lg:text-xl md:text-lg text-md"></i>
                        <p class="text-xl font-bold text-white">{savedCount}</p>
                    </div>
                </div>
                <div class="flex-1 flex flex-col items-center gap-2 select-none md:px-8">
                    <p class="text-xs text-stone-400">Reviews Written</p>
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-comment-dots text-primary lg:text-xl md:text-lg text-md"></i>
                        <p class="text-xl font-bold text-white">{reviewCount}</p>
                    </div>
                </div>
                <div class="flex-1 flex flex-col items-center gap-2 select-none md:px-8">
                    <p class="text-xs text-stone-400">Member Since</p>
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-calendar-days text-primary lg:text-xl md:text-lg text-md"></i>
                        <p class="text-xl font-bold text-white">{memberSince || '—'}</p>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <!-- Feature Cards -->
    <!-- <div class="flex flex-wrap justify-center gap-10 mt-16">
        <Card title="Server Status" description="Check the live status, player count, and details of any Minecraft server." path="status" />
        <Card title="Discover Servers" description="Browse through popular Minecraft servers, search for specific ones, or leave a review." path="explore" />
        <Card title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." path="profiles" />
    </div> -->

    <div class="flex flex-wrap justify-center gap-10 mt-15">
        <Card iconClass={"fa-solid fa-magnifying-glass"} title="Server Status" description="Check the live status, player count, and details of any Minecraft server." href="#/status"/>
        <Card iconClass={"fa-regular fa-map"} title="Discover Servers" description="Browse through popular Minecraft servers, search for specific ones, or leave a review." href="#/explore"/>
        <Card iconClass={"fa-regular fa-address-book"} title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." href="#/profiles"/>
    </div>
</div>
