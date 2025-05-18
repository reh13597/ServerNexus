<script lang="ts">
    import { privateProfiles, profile } from '../../stores/profiles';
    import { params, push } from 'svelte-spa-router';
    import { supabase } from '../../supabase';
    import { onMount } from 'svelte';

    let profileId = $params.profileId;
    let profileData = null;

    $profile = true;

    let tab1 = false;
    let tab2 = false;
    let tab3 = false;
    let tab4 = false;

    function handleTab1() {
        tab1 = true;
        tab2 = false;
        tab3 = false;
        tab4 = false;
        push('/profile/${profile.id}/profile-status');
    }

    function handleTab2() {
        tab1 = false;
        tab2 = true;
        tab3 = false;
        tab4 = false;
        push('/profile/${profile.id}/chat');
    }

    function handleTab3() {
        tab1 = false;
        tab2 = false;
        tab3 = true;
        tab4 = false;
        push('/profile/${profile.id}/stats');
    }

    function handleTab4() {
        tab1 = false;
        tab2 = false;
        tab3 = false;
        tab4 = true;
        push('/profile/${profile.id}/map');
    }

    function goBack() {
        if ($privateProfiles) {
            push('/private-profiles');
        } else {
            push('/public-profiles');
        }
    }

    onMount(async () => {
        handleTab1();

        const { data, error } = await supabase
            .from('servers')
            .select('id')
            .eq('owner_id', profileId)
            .single();

        if (error) {
            console.error(error);
        } else {
            profileData = data;
        }
    });
</script>

<div class="flex items-center justify-center mt-5">
    <button onclick={() => goBack()} class="btn btn-primary btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M15 5l-7 7 7 7"></path></g></svg>
    </button>

    <div role="tablist" class="tabs text-primary tabs-lg">
        {#if tab2}
            <a onclick={() => {handleTab1()}} role="tab" class="tab">Status</a>
            <a onclick={() => {handleTab2()}} role="tab" class="tab tab-active">Chat</a>
            <a onclick={() => {handleTab3()}} role="tab" class="tab">Stats & Achievements</a>
            <a onclick={() => {handleTab4()}} role="tab" class="tab">Map</a>
        {:else if tab3}
            <a onclick={() => {handleTab1()}} role="tab" class="tab">Status</a>
            <a onclick={() => {handleTab2()}} role="tab" class="tab">Chat</a>
            <a onclick={() => {handleTab3()}} role="tab" class="tab tab-active">Stats & Achievements</a>
            <a onclick={() => {handleTab4()}} role="tab" class="tab">Map</a>
        {:else if tab4}
            <a onclick={() => {handleTab1()}} role="tab" class="tab">Status</a>
            <a onclick={() => {handleTab2()}} role="tab" class="tab">Chat</a>
            <a onclick={() => {handleTab3()}} role="tab" class="tab">Stats & Achievements</a>
            <a onclick={() => {handleTab4()}} role="tab" class="tab tab-active">Map</a>
        {:else}
            <a onclick={() => {handleTab1()}} role="tab" class="tab tab-active">Status</a>
            <a onclick={() => {handleTab2()}} role="tab" class="tab">Chat</a>
            <a onclick={() => {handleTab3()}} role="tab" class="tab">Stats & Achievements</a>
            <a onclick={() => {handleTab4()}} role="tab" class="tab">Map</a>
        {/if}
    </div>
</div>
