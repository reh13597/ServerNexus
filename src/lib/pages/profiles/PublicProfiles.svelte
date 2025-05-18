<script lang="ts">
    import ListElement from '../../components/ListElement.svelte';
    import { privateProfiles } from '../../stores/profiles';
    import { onMount } from 'svelte';
    import { supabase } from '../../supabase';

    let servers: { id:string; owner_id: string; owner: string; ip: string; port: number; };

    $privateProfiles = false;

    onMount(async () => {
      const { data, error} = await supabase
        .from('servers')
        .select('*')
        .eq('public', true);

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        servers = data;
      }
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
        <!--on:click={() => privateProfiles.update(n => !n)}-->
    </div>
</div>

<div class="max-w-2xl mx-auto mt-15">
    <ul class="list bg-base-100 rounded-box shadow-md max-h-[55vh] overflow-y-auto">
      {#each servers as server, index}
        <ListElement number={index + 1} username={server.owner} host={server.ip} />
      {/each}
    </ul>
</div>
