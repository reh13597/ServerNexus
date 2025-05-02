<script lang="ts">
    import ListElement from '../../components/ListElement.svelte';
    import { privateProfiles } from '../../stores/profiles';
    $privateProfiles = false;
</script>

<div>
    <h1 class="text-4xl font-bold mt-10">View public server profiles!</h1>
    <div class="max-w-2xl mx-auto flex gap-4 mt-10">
        <label class="input grow">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" class="grow" placeholder="Search" />
        </label>
        <button class="btn btn-primary">View Favourites</button>
        <!--on:click={() => privateProfiles.update(n => !n)}-->
    </div>
</div>

<div class="max-w-2xl mx-auto mt-15">
    <ul class="list bg-base-100 rounded-box shadow-md max-h-[55vh] overflow-y-auto">
        <ListElement number=1 username="reh13597" host="hypixel.net" />
        <ListElement number=2 username="kevdawg33" host="stray.gg" />
        <ListElement number=3 username="notch" host="minehut.gg" />
        <ListElement number=4 username="notch" host="minehut.gg" />
        <ListElement number=5 username="notch" host="minehut.gg" />
        <ListElement number=6 username="notch" host="minehut.gg" />
        <ListElement number=7 username="notch" host="minehut.gg" />
        <ListElement number=8 username="notch" host="minehut.gg" />
        <ListElement number=9 username="notch" host="minehut.gg" />
        <ListElement number=10 username="notch" host="minehut.gg" />
    </ul>
</div>
