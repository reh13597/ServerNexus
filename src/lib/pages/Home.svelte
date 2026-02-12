<script lang="ts">
    import Card from '../components/Cards/HomeCard.svelte';
</script>

<div class="px-5 select-none ">
    <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold mt-30 text-balance">Your one-stop location for everything Minecraft server.</h1>

    <div class="flex flex-wrap justify-center gap-10 mt-20 sm:pb-10 pb-10">
        <Card iconClass={"fa-solid fa-magnifying-glass"} title="Server Status" description="Check the live status, player count, and details of any Minecraft server."/>
        <Card iconClass={"fa-regular fa-map"} title="Explore Servers" description="Browse through popular Minecraft servers and search for specific ones."/>
        <Card iconClass={"fa-regular fa-address-book"} title="Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews."/>
    </div>
</div>
