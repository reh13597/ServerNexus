<script lang="ts">
    import type { ServerProfile } from '../../types/serverInfo';
    import { serverID } from '../../stores/profiles';
    import { userID } from '../../stores/user';
    import { push } from 'svelte-spa-router';
    import { supabase } from '../../supabase';
    import { onMount } from 'svelte';

    export let profile: ServerProfile;
    let btnActive = false;

    function goTo() {
        $serverID = profile.id;
        push(`/server-info/${profile.id}`);
    }

    async function saveOrUnsave() {
        if (!btnActive) {
            btnActive = true;

            const { error } = await supabase
                .from('saved_servers')
                .insert({ user_id: $userID, server_id: profile.id })

            if (error) {
                console.error('Error inserting saved server:', error);
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
                console.error('Error deleting saved server:', error);
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
            console.error('Error loading saved server:', error);
            return;
        }

        btnActive = data.length > 0;
    }

    onMount(() => {
        loadSaved();
    });
</script>

<li class="drop-shadow-xl/80 list-row flex items-center justify-between border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
    <div class="flex items-center gap-2 md:gap-4">
        <img src={profile.icon} alt="Server Icon" class="rounded-lg w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 select-none" />
        <div class="text-xs md:text-lg lg:text-xl text-left">{profile.host}</div>
    </div>

    <div class="flex items-center gap-2 sm:gap-2 md:gap-6 lg:gap-6 lg:text-xl md:text-lg text-sm">
        <div class="flex items-center gap-1">
            <i class="fa-star fa-solid text-primary"></i>
            <p class="select-none">{profile.avg_rating.toFixed(1)}</p>
        </div>

        <a on:click={() => saveOrUnsave()} class="inline-flex w-fit hover:scale-110 transition duration-200 hover:cursor-pointer hover:text-primary" aria-label="Save Button">
            <i class={`fa-bookmark ${btnActive ? 'fa-solid text-primary' : 'fa-regular'}`}></i>
        </a>
        <a on:click={() => goTo()} class="inline-flex w-fit hover:scale-110 transition duration-200 hover:cursor-pointer hover:text-primary" aria-label="View Button">
            <i class="fa-arrow-right fa-solid"></i>
        </a>
    </div>
</li>