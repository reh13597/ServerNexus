<script lang="ts">
    import type { ServerProfile } from '../../types/serverInfo';
    import { isLoggedIn } from '../../stores/login';
    import { serverID } from '../../stores/profiles';
    import { userID } from '../../stores/user';
    import { push } from 'svelte-spa-router';
    import { supabase } from '../../supabase';
    import { onMount } from 'svelte';

    export let profile: ServerProfile;
    let btnActive = false;
    let copied = false;

    function goTo() {
        $serverID = profile.id;
        push(`/server-info/${profile.id}`);
    }

    async function copyToClipboard() {
        await navigator.clipboard.writeText(profile.host);
        copied = true;
        setTimeout(() => copied = false, 3000);
    }

    async function saveOrUnsave() {
        if (!btnActive) {
            btnActive = true;

            const { error } = await supabase
                .from('saved_servers')
                .insert({ user_id: $userID, server_id: profile.id })

            if (error) {

                return;
            }
        } else {
            btnActive = false;

            const { error } = await supabase
                .from('saved_servers')
                .delete()
                .eq('user_id', $userID)
                .eq('server_id', profile.id)

            if (error) {

                return;
            }
        }
    }

    async function loadSaved() {
        const { data, error } = await supabase
            .from('saved_servers')
            .select('*')
            .eq('user_id', $userID)
            .eq('server_id', profile.id)



        if (error) {

            return;
        }

        btnActive = data.length > 0;
    }

    onMount(() => {
        if ($isLoggedIn) {
            loadSaved();
        }
    });
</script>

<li class="drop-shadow-xl/80 list-row flex items-center gap-2 md:gap-3 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
    <img src={profile.icon} alt="Server Icon" class="rounded-lg w-8 h-8 md:w-10 md:h-10 select-none flex-shrink-0" />
    <div class="cursor-pointer text-sm md:text-md text-left break-all min-w-0 flex-1" on:click={copyToClipboard}>
        {profile.host}
        {#if copied}
            <i class="text-xs fa-solid fa-check text-green-500"></i>
        {:else}
            <i class="text-xs fa-regular fa-copy hover:text-primary transition-colors"></i>
        {/if}
    </div>
    <div class="flex items-center gap-3 md:gap-4 text-sm md:text-md flex-shrink-0">
        <div class="flex items-center gap-1">
            <i class="fa-star fa-solid text-primary"></i>
            <p class="select-none">{profile.avg_rating.toFixed(1)}</p>
        </div>
        {#if $isLoggedIn}
          <a on:click={() => saveOrUnsave()} class="drop-shadow-xl/90 inline-flex w-fit hover:scale-115 transition duration-300 hover:cursor-pointer hover:text-primary" aria-label="Save Button">
              <i class={`fa-bookmark ${btnActive ? 'fa-solid text-primary' : 'fa-regular'}`}></i>
          </a>
        {/if}
        <a on:click={() => goTo()} class="drop-shadow-xl/90 inline-flex w-fit hover:scale-115 transition duration-300 hover:cursor-pointer hover:text-primary" aria-label="View Button">
            <i class="fa-arrow-right fa-solid"></i>
        </a>
    </div>
</li>