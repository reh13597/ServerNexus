<script lang="ts">
    import { username } from '../stores/user';
    import Card from '../components/Cards/DashCard.svelte';
</script>

<div class="px-5 pb-10" style="min-height: calc(100vh - 200px);">
    <h1 class="lg:text-4xl md:text-3xl text-2xl font-bold md:mt-30 mt-25 select-none">Welcome, <span class="text-primary">{$username}</span></h1>
    <p class="mt-10 text-md md:text-lg text-stone-400">Explore everything Server Nexus has to offer.</p>
    <p class="mt-10 text-sm text-stone-400"><span class="text-primary">Note:</span> <br>Currently, only Java edition servers are supported. Bedrock edition support is coming soon!</p>
    <div class="flex flex-wrap justify-center gap-10 md:mt-30 mt-20">
        <Card title="Server Status" description="Check the live status, player count, and details of any Minecraft server." path="status" />
        <Card title="Discover Servers" description="Browse through popular Minecraft servers and search for specific ones." path="explore" />
        <Card title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." path="profiles" />
    </div>
</div>
