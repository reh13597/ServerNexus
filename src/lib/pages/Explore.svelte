<script lang="ts">
    import ListElement from '../components/ListElement.svelte';
    import { privateProfiles } from '../stores/profiles';
/*     import { userID } from '../../stores/user'; */
    import { supabase } from '../supabase';
    import { onMount } from 'svelte';
    import type { ServerProfile } from '../types/serverInfo';

    let servers: ServerProfile;
/*     let btnActive = false; */
    $privateProfiles = false;

    async function getProfileData() {
      const { data, error} = await supabase
        .from('servers')
        .select('id, host, port, icon')

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      servers = data ?? [];
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
      getProfileData();
    });
</script>

<div>
    <h1 class="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-30 text-primary select-none">Browse through popular servers!</h1>
    <div class="max-w-3xl mx-auto flex gap-6 mt-10 p-5 sm:p-5 md:p-0 lg:p-0">
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
            <input type="search" class="grow" placeholder="Search for a server" />
        </label>
        <button class="btn btn-primary">View Saved</button>
<!--    <button on:click={() => viewFav()} class={`btn ${btnActive ? 'btn btn-primary' : 'btn btn-primary btn-ghost'}`}>View Favourites</button> -->    </div>
</div>

<div class="max-w-3xl mx-auto mt-10 p-5 sm:p-5 md:p-0 lg:p-0">
    <ul class="list p-5 bg-base-100 rounded-box max-h-[65vh] overflow-y-auto space-y-5">
      {#each servers as server}
        <ListElement profile={server} />
      {/each}
    </ul>
</div>
