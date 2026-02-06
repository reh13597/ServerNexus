<script lang="ts">
    import { username } from '../stores/user';
    import Card from '../components/Cards/DashCard.svelte';
</script>

<div>
    <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold text-primary mt-40 select-none">Welcome, {$username}!</h1>
    <div class="flex flex-wrap justify-center gap-10 mt-20 sm:pb-10 pb-10">
        <Card title="Server Status" description="Check the live status, player count, and details of any Minecraft server." path="status" />
        <Card title="Explore Servers" description="Browse through popular Minecraft servers and search for specific ones." path="explore" />
        <Card title="Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." path="profiles" />
    </div>
</div>
