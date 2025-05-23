<script lang="ts">
    import { username } from '../stores/user';
    import Card from '../components/Cards/DashCard.svelte';
</script>

<div>
    <h1 class="text-4xl font-bold mt-10">Welcome, {$username}!</h1>

    <div class="flex flex-wrap justify-center gap-10 mt-30 mb-10">
        <Card title="Server Status" description="Check the status of any Minecraft server." path="status" />
        <Card title="Server Profiles" description="View public server profiles." path="public-profiles" />
        <Card title="My Profiles" description="Create and view your own server profiles." path="private-profiles" />
    </div>
</div>
