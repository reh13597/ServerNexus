<script lang="ts">
    import { privateProfiles, serverProfile } from '../stores/profiles';
    import { supabase } from '../supabase';
    import type { ServerProfile } from '../types/serverInfo';
    import { push } from 'svelte-spa-router';

    export let number: number;
    export let profile: ServerProfile;
    let btnActive = false;

    function goTo() {
        $serverProfile = profile;
        push(`/${profile.id}/profile-status`);
    }

    async function addFav() {
        btnActive = !btnActive;

        const { error } = await supabase
            .from('servers')
            .update({ favourited: btnActive })
            .eq('id', profile.id)

        if (error) {
            console.error('Error inserting profile:', error.message, error.details);
            return;
        }
    }
</script>

<li class="list-row">
    <div class="text-4xl font-thin opacity-30 tabular-nums w-15 text-left">{number}.</div>
    <div class="text-center flex-1">
        <div>{profile.owner}</div>
        <div class="text-xs font-semibold opacity-60">{profile.ip}</div>
    </div>
    {#if $privateProfiles}
        <button on:click={() => goTo()} class="btn btn-primary btn-square btn-ghost">
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M9 5l7 7-7 7"></path></g></svg>
        </button>
    {:else}
        <button on:click={() => addFav()} class={`btn ${btnActive ? 'btn btn-primary btn-square' : 'btn btn-primary btn-square btn-ghost'}`}>
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.4 7.4-6-4.6-6 4.6 2.4-7.4-6-4.6h7.6z"></path></g></svg>
        </button>
        <button on:click={() => goTo()} class="btn btn-primary btn-square btn-ghost">
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M9 5l7 7-7 7"></path></g></svg>
        </button>
    {/if}
</li>