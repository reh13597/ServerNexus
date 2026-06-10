<script lang="ts">
    import Card from '../components/Cards/HomeCard.svelte';
</script>

<!-- Section 1: Hero Welcome -->
<div class="hero min-h-screen" style="background-image: url(https://i.imgur.com/b94EqPg.png);">
    <div class="hero-overlay"></div>
    <div class="px-5 select-none mx-auto flex flex-col items-center">
        <h1 class="max-w-2xl lg:text-5xl md:text-3xl text-2xl font-bold mt-25 md:mt-30">Your one-stop location for everything <span class="text-primary">Minecraft server</span></h1>
        <p class="mt-5 md:mt-10 text-lg md:text-xl text-stone-300">Embark on your Server Nexus journey.</p>
        <a target="_blank" href="https://www.reddit.com/r/Minecraft/comments/mw5dmq/the_knew_ice_caves_with_shaders_look_stunning/" class="pb-5 mt-30 text-stone-300 text-sm select-none hover:underline">
            Image belongs to klaus_nieto's post on r/Minecraft
        </a>
    </div>
</div>

<!-- Section 2: Features + Auth Links -->
<div class="py-20 px-5 flex flex-col items-center">
    <h2 class="text-3xl font-bold select-none mb-4">Explore <span class="text-primary">Features</span></h2>
    <p class="text-stone-400 select-none mb-14 text-lg">Everything you need, all in one place.</p>
    <div class="flex flex-wrap justify-center gap-10">
        <Card iconClass={"fa-solid fa-magnifying-glass"} title="Server Status" description="Check the live status, player count, and details of any Minecraft server." href="#/status"/>
        <Card iconClass={"fa-regular fa-map"} title="Discover Servers" description="Browse through popular Minecraft servers, search for specific ones, or leave a review." href="#/explore"/>
        <Card iconClass={"fa-regular fa-address-book"} title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews." badge="Members Only"/>
    </div>
    <div class="select-none mt-14">
        <p class="text-md text-stone-300">Already have an account?
            <a class="text-primary hover:underline" href="#/login">Login!</a>
        </p>
        <p class="text-md text-stone-300">Don't have an account yet?
            <a class="text-primary hover:underline" href="#/signup">Sign up!</a>
        </p>
    </div>
</div>
