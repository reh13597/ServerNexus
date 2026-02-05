<script lang="ts">
    import { username } from '../stores/user';
    import Card from '../components/Cards/DashCard.svelte';
</script>

<div>
    <h1 class="text-6xl font-bold mt-10 text-primary">Welcome, {$username}!</h1>
    <div class="flex flex-wrap justify-center gap-10 mt-30">
        <Card title="Server Status" description="Check the live status, player count, and details of any Minecraft server." path="status" />
        <Card title="Explore Servers" description="Browse through popular Minecraft servers and search for specific ones." path="explore" />
        <Card title="Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." path="profiles" />
    </div>
</div>
