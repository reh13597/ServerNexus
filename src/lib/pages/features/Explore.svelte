<script lang="ts">
    import ServerElement from '../../components/ServerElement.svelte';
    import { userID } from '../../stores/user';
    import { supabase } from '../../supabase';
    import { onMount } from 'svelte';
    import type { ServerProfile } from '../../types/serverInfo';

    let servers: ServerProfile;
    let savedServers: ServerProfile;
    let btnActive = false;
    let emptyList = false;
    let isLoading = false;

    async function getServerData() {
      isLoading = true;

      const { data, error } = await supabase
        .from('servers_with_rating')
        .select('id, host, port, icon, avg_rating')

      if (error) {
        console.error('Error fetching servers:', error);
      } else {
        servers = data ?? [];
        isLoading = false;
      }
    }

    async function viewSaved() {
      if (!btnActive) {
        btnActive = true;
        isLoading = true;

        const { data, error } = await supabase
          .from('saved_servers_with_rating')
          .select('id, host, port, icon, avg_rating')
          .eq('user_id', $userID)

        if (error) {
          console.error('Error fetching saved servers:', error);
        } else {
          savedServers = data ?? [];

          if (savedServers.length === 0) {
            emptyList = true;
          } else {
            emptyList = false;
          }

          await new Promise(r => setTimeout(r, 400));
          isLoading = false;
        }
      } else {
        isLoading= true;
        await new Promise(r => setTimeout(r, 400));
        isLoading = false;
        btnActive = false;
      }
    }

    onMount(() => {
      getServerData();
    });
</script>
<div class="px-5 pb-12">
  <div>
    <h1 class="text-xl md:text-2xl lg:text-3xl font-bold mt-25 md:mt-30 select-none">Browse through popular Minecraft servers</h1>
    <p class="mt-5 text-sm md:text-md text-stone-400">Discover the top-rated servers, check their information, and see user reviews.</p>
    <div class="max-w-3xl mx-auto flex gap-6 md:mt-10 p-5 sm:p-5 md:p-0 lg:p-0 drop-shadow-xl/80">
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
      <button on:click={() => viewSaved()} class={`drop-shadow-xl/80 btn hover:scale-110 transition duration-200 ${btnActive ? 'btn-primary' : 'btn-ghost border-1 border-gray-500 hover:bg-primary'}`}>View Saved</button>
    </div>
  </div>

  <div class="max-w-3xl mx-auto md:mt-10 p-5 sm:p-5 md:p-0 lg:p-0">
    {#if !isLoading}
      <ul class="drop-shadow-xl/80 list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box h-[55vh] overflow-y-auto space-y-5">
        {#if btnActive}
          {#if emptyList}
          <div class="p-5 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-md sm:text-md md:text-lg lg:text-xl text-left">Looks kind of empty here... go save some servers!</div>
          {:else}
            {#each savedServers as server}
              <ServerElement profile={server} />
            {/each}
          {/if}
        {:else}
          {#each servers as server}
            <ServerElement profile={server} />
          {/each}
        {/if}
      </ul>
    {:else}
      <ul class="drop-shadow-xl/80 list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box h-[55vh] space-y-5">
        {#each [0, 1, 2, 3] as _}
          <li class="drop-shadow-xl/80 list-row flex items-center justify-between border-1 border-neutral bg-zinc-700">
            <div class="flex items-center gap-3">
              <div class="skeleton rounded-lg w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12"></div>
              <div class="skeleton h-6 w-32 md:w-48"></div>
            </div>
            <div class="flex items-center gap-2 sm:gap-2 md:gap-6 lg:gap-6">
              <div class="skeleton h-5 w-10"></div>
              <div class="skeleton h-5 w-5"></div>
              <div class="skeleton h-5 w-5"></div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

