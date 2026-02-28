<script lang="ts">
    import type { ReviewInfo } from '../types/reviewInfo';
    import { userID } from '../stores/user';
    import Steve from '../../assets/steve.jpg';
    import { supabase } from '../supabase';

    export let info: ReviewInfo;
    export let onDeleted: (id: number) => void = () => {};

    let isDeleting = false;

    function openModal() {
        (document.getElementById(`delete_modal_${info.id}`) as HTMLDialogElement)?.showModal();
    }

    function closeModal() {
        (document.getElementById(`delete_modal_${info.id}`) as HTMLDialogElement)?.close();
    }

    async function deleteReview() {
        isDeleting = true;
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', info.id);

        if (error) {
            console.error('Failed to delete review:', error);
            isDeleting = false;
            closeModal();
        } else {
            onDeleted(info.id);
            closeModal();
        }
    }
</script>

<li class="drop-shadow-xl/80 list-row max-w-lg flex flex-col border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
    <div class="flex items-center gap-5">
        <div class="avatar">
            <div class="w-8 md:w-10 rounded">
              <img src={Steve} alt="The users' Minecraft avatar." />
            </div>
          </div>
        <p class="select-none text-md md:text-lg">{info.username}</p>
        <div class="flex items-center gap-1">
            <i class="fa-star fa-solid text-primary text-md md:text-lg"></i>
            <p class="select-none text-sm md:text-md">{info.rating}/5</p>
        </div>

        {#if $userID === String(info.user_id)}
            <a
                on:click={openModal}
                class="cursor-pointer hover:scale-115 transition duration-200 text-md md:text-lg ml-auto"
                aria-label="delete icon"
            >
                <i class="fa-solid fa-trash-can hover:text-primary"></i>
            </a>
        {/if}
    </div>

    <dialog id="delete_modal_{info.id}" class="modal">
        <div class="modal-box flex flex-col gap-5 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
            <h3 class="text-lg font-bold"><span class="text-primary">Delete</span> your review?</h3>
            <p class="py-4 text-stone-400 text-sm">Caution: This action cannot be undone.</p>
            <div class="flex justify-center gap-3">
                <button class="btn btn-ghost border-1 border-gray-500 hover:bg-primary hover:scale-105 transition duration-200" on:click={closeModal} disabled={isDeleting}>Cancel</button>
                <button class="btn btn-primary hover:scale-105 transition duration-200" on:click={deleteReview} disabled={isDeleting}>
                    {#if isDeleting}
                        <span class="loading loading-spinner loading-xs"></span>
                    {:else}
                        Delete
                    {/if}
                </button>
            </div>
        </div>
    </dialog>

    <div class="flex items-center">
        <p class="text-stone-400 text-xs md:text-sm italic text-left">{info.review}</p>
    </div>
</li>