<script lang="ts">
    import type { ServerProfile } from '../types/serverInfo';
    import { serverID } from '../stores/profiles';
    import { userID } from '../stores/user';
    import { push } from 'svelte-spa-router';
    import { supabase } from '../supabase';
    import { onMount } from 'svelte';

    export let profile: ServerProfile;
    let btnActive = false;

    function goTo() {
        $serverID = profile.id;
        push(`/${profile.id}/server-info`);
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

<li class="list-row flex items-center justify-between glass bg-gradient-to-l from-base-100 to-zinc-600">
    <div class="flex items-center gap-3">
        <img src={profile.icon} alt="Server Icon" class="max-w-10 max-h-10 sm:max-w-10 sm:max-h-10 md:max-w-15 md:max-h-15 lg:max-w-20 lg:max-h-20 select-none" />
        <div class="text-md sm:text-md md:text-lg lg:text-2xl text-left">{profile.host}</div>
    </div>

    <div class="flex items-center gap-2 sm:gap-2 md:gap-6 lg:gap-6 lg:text-2xl md:text-lg sm:text-md text-md">
        <div class="flex items-center gap-1">
            <i class="fa-star fa-solid text-primary"></i>
            <p class="select-none">{profile.avg_rating.toFixed(1)}</p>
        </div>

        <a on:click={() => saveOrUnsave()} class="inline-flex w-fit bg-transparent hover:cursor-pointer hover:text-primary" aria-label="Save Button">
            <i class={`fa-bookmark ${btnActive ? 'fa-solid text-primary' : 'fa-regular'}`}></i>
        </a>
        <a on:click={() => goTo()} class="inline-flex w-fit bg-transparent hover:cursor-pointer hover:text-primary" aria-label="View Button">
            <i class="fa-arrow-right fa-solid"></i>
        </a>
    </div>
</li>