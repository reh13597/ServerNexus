<script lang="ts">
    import Card from '../components/Cards/HomeCard.svelte';
</script>
<div class="hero min-h-screen" style="background-image: url(https://i.imgur.com/b94EqPg.png);"> <!-- https://i.imgur.com/b94EqPg.png --> <!-- https://i.redd.it/92fyeqg1hfre1.png -->
    <div class="hero-overlay"></div>
    <div class="px-5 select-none mx-auto max-w-7xl">
        <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold mt-25 md:mt-30 text-balance">Your one-stop location for everything <span class="text-primary">Minecraft server</span></h1>
        <p class="mt-5 md:mt-10 text-lg md:text-xl text-stone-300">Embark on your Server Nexus journey.</p>
        <div class="flex flex-wrap justify-center gap-10 md:mt-20 mt-10 sm:pb-10 pb-10">
            <Card iconClass={"fa-solid fa-magnifying-glass"} title="Server Status" description="Check the live status, player count, and details of any Minecraft server."/>
            <Card iconClass={"fa-regular fa-map"} title="Discover Servers" description="Browse through popular Minecraft servers and search for specific ones."/>
            <Card iconClass={"fa-regular fa-address-book"} title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews."/>
        </div>
        <div class="pb-10 select-none">
            <p class="mt-5 text-lg text-stone-300">Already have an account?
                <a class="text-lg text-primary hover:underline" href="#/login">Login!</a>
            </p>
            <p class="mt-5 text-lg text-stone-300">Don't have an account yet?
                <a class="text-lg text-primary hover:underline" href="#/signup">Sign up!</a>
            </p>
        </div>
        <a target="_blank" href="https://www.reddit.com/r/Minecraft/comments/mw5dmq/the_knew_ice_caves_with_shaders_look_stunning/" class="hover:underline">
            <p class="pb-5 mt-10 text-stone-300 text-sm select-none">Image belongs to klaus_nieto's post on r/Minecraft</p>
        </a>
    </div>
</div>

