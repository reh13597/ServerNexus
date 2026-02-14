<script lang="ts">
    import { username } from '../stores/user';
    import Card from '../components/Cards/DashCard.svelte';
</script>

<div class="px-5">
    <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold lg:mt-30 mt-20 select-none">Welcome, <span class="text-primary">{$username}</span></h1>
    <p class="mt-10 text-xl text-stone-400">Explore everything Server Nexus has to offer.</p>
    <p class="mt-10 text-md text-stone-400"><span class="text-primary">Note:</span> <br>Currently, only Java edition servers are supported. Bedrock edition support is coming soon!</p>
    <div class="flex flex-wrap justify-center gap-10 md:mt-20 mt-10 sm:pb-10 pb-10">
        <Card title="Server Status" description="Check the live status, player count, and details of any Minecraft server." path="status" />
        <Card title="Discover Servers" description="Browse through popular Minecraft servers and search for specific ones." path="explore" />
        <Card title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." path="profiles" />
    </div>
</div>
