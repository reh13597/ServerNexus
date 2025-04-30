<script lang="ts">
    import { username } from '../stores/username';
    import DashboardCard from '../components/DashboardCard.svelte';
</script>

<div>
    <h1 class="text-4xl font-bold mt-10">Welcome, {$username}!</h1>

    <div class="flex flex-wrap justify-center gap-10 mt-30">
        <DashboardCard title="Server Status" description="Check the status of any Minecraft server." path="server-status" />
        <DashboardCard title="Server Profiles" description="View public server profiles." path="public-profiles" />
        <DashboardCard title="My Profiles" description="Create and view your own server profiles." path="private-profiles" />
    </div>
</div>
