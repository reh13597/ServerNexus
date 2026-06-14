<script lang="ts">
    import type { ReviewInfo } from '../../types/reviewInfo';
    import { userID } from '../../stores/user';
    import { isLoggedIn } from '../../stores/login';
    import Steve from '../../../assets/steve.jpg';
    import { supabase } from '../../supabase';
    import { fade, scale } from 'svelte/transition';
    import { push } from 'svelte-spa-router';

    export let info: ReviewInfo;
    export let onDeleted: (id: number) => void = () => {};
    export let serverHost: string = '';
    export let serverId: number | null = null;

    let isDeleting = false;
    let showModal = false;
    let serverHostCopied = false;

    function portal(node: HTMLElement) {
        requestAnimationFrame(() => {
            document.body.appendChild(node);
        });

        return {
            destroy() {
                node.remove();
            }
        };
    }

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    async function copyServerHost() {
        await navigator.clipboard.writeText(serverHost);
        serverHostCopied = true;
        setTimeout(() => serverHostCopied = false, 3000);
    }

    async function deleteReview() {
        isDeleting = true;
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', info.id);

        if (error) {

            isDeleting = false;
            closeModal();
        } else {
            onDeleted(info.id);
            isDeleting = false;
            closeModal();
        }
    }
</script>

<li class="drop-shadow-xl/80 list-row w-full flex flex-col gap-2 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
    <!-- Row 1: avatar + username + rating + action buttons -->
    <div class="flex items-center gap-3">
        <div class="avatar flex-shrink-0" class:cursor-pointer={$isLoggedIn} on:click={() => $isLoggedIn && push(`/profile/${info.user_id}`)}>
            <div class="w-7 md:w-8 rounded">
                <img src={info.avatar || Steve} alt="The users' Minecraft avatar." />
            </div>
        </div>
        <p
            class="select-none text-sm md:text-md truncate {$isLoggedIn ? 'cursor-pointer hover:text-primary transition duration-300' : ''}"
            on:click={() => $isLoggedIn && push(`/profile/${info.user_id}`)}
        >{info.username}</p>
        <span class="text-stone-500 select-none">|</span>
        <div class="flex items-center gap-1 text-xs md:text-sm flex-shrink-0">
            <i class="fa-star fa-solid text-primary"></i>
            <span class="select-none text-stone-400">{info.rating}/5</span>
        </div>
        <div class="flex items-center gap-3 ml-auto flex-shrink-0">
            {#if $userID === String(info.user_id)}
                <a on:click={() => { openModal(); }} class="cursor-pointer hover:text-primary hover:scale-110 transition duration-300" aria-label="delete icon">
                    <i class="fa-solid fa-trash-can"></i>
                </a>
            {/if}
            {#if serverId}
                <a on:click={() => push(`/server-info/${serverId}`)} class="cursor-pointer hover:text-primary hover:scale-110 transition duration-300" aria-label="view server">
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            {/if}
        </div>
    </div>

    <!-- Row 2: server host (if present) -->
    {#if serverHost}
        <div class="flex items-center gap-2 text-xs md:text-sm text-stone-400">
            <div class="flex items-center gap-1 cursor-pointer" on:click={copyServerHost}>
                <span class="break-all">{serverHost}</span>
                {#if serverHostCopied}
                    <i class="fa-solid fa-check text-green-500 flex-shrink-0"></i>
                {:else}
                    <i class="fa-regular fa-copy hover:text-primary transition-colors flex-shrink-0"></i>
                {/if}
            </div>
        </div>
    {/if}

    <!-- Row 3: review text -->
    <p class="text-stone-400 text-xs md:text-sm italic text-left">{info.review}</p>
</li>

{#if showModal}
    <div use:portal class="modal modal-open" style="z-index: 9999;" transition:fade={{ duration: 300 }}>
        <div class="modal-box flex flex-col gap-5 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700" transition:scale={{ duration: 300, start: 0.95 }}>
            <h3 class="text-lg font-bold"><span class="text-primary">Delete</span> your review?</h3>
            <p class="py-4 text-stone-400 text-sm"><span class="text-primary">Caution:</span> This action cannot be undone.</p>
            <div class="flex justify-center gap-3">
                <button class="btn btn-primary hover:scale-105 transition duration-300" on:click={closeModal} disabled={isDeleting}>Cancel</button>
                <button class="btn btn-ghost border-1 border-gray-500 hover:bg-primary hover:scale-105 transition duration-300" on:click={deleteReview} disabled={isDeleting}>
                    {#if isDeleting}
                        <span class="loading loading-spinner loading-xs"></span>Deleting...
                    {:else}
                        Delete
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}
