<script lang="ts">
    import ListElement from '../../components/ListElement.svelte';
    import { privateProfiles } from '../../stores/profiles';
/*     import { userID } from '../../stores/login'; */
    import { onMount } from 'svelte';
    import { supabase } from '../../supabase';
    import type { ServerProfile } from '../../types/serverInfo';

    let servers: ServerProfile;
/*     let btnActive = false; */
    $privateProfiles = false;

    async function getServerData() {
      const { data, error} = await supabase
        .from('servers')
        .select('*')
        .eq('public', true)

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        servers = data;
      }
    }

    /* async function viewFav() {
      btnActive = !btnActive;

      const { data, error} = await supabase
        .from('servers')
        .select('*')
        .eq('favourited', true)
        .eq('owner_id', $userID)

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        servers = data;
      }

      getServerData();
    } */

    onMount(() => {
      getServerData();
    });
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
<!--    <button on:click={() => viewFav()} class={`btn ${btnActive ? 'btn btn-primary' : 'btn btn-primary btn-ghost'}`}>View Favourites</button> -->    </div>
</div>

<div class="max-w-2xl mx-auto mt-15">
    <ul class="list bg-base-100 rounded-box shadow-md max-h-[55vh] overflow-y-auto">
      {#each servers as server, index}
        <ListElement profile={server} number={index + 1} />
      {/each}
    </ul>
</div>
