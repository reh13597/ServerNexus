<script lang="ts">
    import Card from '../components/Cards/HomeCard.svelte';
</script>
<div class="hero min-h-screen" style="background-image: url(https://i.imgur.com/b94EqPg.png);"> <!-- https://i.imgur.com/b94EqPg.png --> <!-- https://i.redd.it/92fyeqg1hfre1.png -->
    <div class="hero-overlay"></div>
    <div class="px-5 select-none mx-auto flex flex-col items-center">
        <h1 class="max-w-2xl lg:text-5xl md:text-3xl text-2xl font-bold mt-25 md:mt-30">Your one-stop location for everything <span class="text-primary">Minecraft server</span></h1>
        <p class="mt-5 md:mt-10 text-lg md:text-xl text-stone-300">Embark on your Server Nexus journey.</p>
        <div class="flex flex-wrap justify-center gap-10 md:mt-30 mt-20">
            <Card iconClass={"fa-solid fa-magnifying-glass"} title="Server Status" description="Check the live status, player count, and details of any Minecraft server."/>
            <Card iconClass={"fa-regular fa-map"} title="Discover Servers" description="Browse through popular Minecraft servers, search for specific ones, or leave a review."/>
            <Card iconClass={"fa-regular fa-address-book"} title="User Profiles" description="Modify your profile and browse through public profiles to see their server ratings/reviews."/>
        </div>
        <div class="select-none">
            <p class="mt-10 text-md text-stone-300">Already have an account?
                <a class="text-primary hover:underline" href="#/login">Login!</a>
            </p>
            <p class="text-md text-stone-300">Don't have an account yet?
                <a class="text-primary hover:underline" href="#/signup">Sign up!</a>
            </p>
        </div>
        <a target="_blank" href="https://www.reddit.com/r/Minecraft/comments/mw5dmq/the_knew_ice_caves_with_shaders_look_stunning/" class="hover:underline">
            <p class="pb-5 mt-30 text-stone-300 text-sm select-none">Image belongs to klaus_nieto's post on r/Minecraft</p>
        </a>
    </div>
</div>

