<script lang="ts">
    import type { ServerProfile } from '../types/serverInfo';
    import { error } from '../stores/server';
    import ReviewElement from './ReviewElement.svelte';

    export let profile: ServerProfile;
    let isLoading = false;
    let emptyList = false;
</script>

<div class="flex flex-col w-full xl:flex-row gap-10 mb-10">
    {#if !isLoading}
      <ul class="list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box max-h-[60vh] overflow-y-auto space-y-5">
        {#if emptyList}
          <div class="p-5 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-md sm:text-md md:text-lg lg:text-xl text-left">Looks kind of empty here... go save some servers!</div>
        {:else}
          {#each reviews as review}
            <ReviewElement info={review} />
          {/each}
        {/if}
      </ul>
    {:else}
        <span class="loading loading-spinner loading-xl scale-150 text-primary"></span>
    {/if}

    <div class="flex flex-col gap-5 w-full">
        <div>
            <h1 class="text-xl">Rate & Review the server below</h1>
        </div>
        <div class="rating justify-center">
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="1 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="2 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="3 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="4 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="5 star" />
        </div>

        <div>
            <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Write your review here..."
                class="textarea textarea-bordered w-full mb-3 bg-base-300"></textarea>
        </div>

        <button type="submit" class="btn btn-primary w-full hover:scale-105 transition duration-200">Submit Review</button>
    </div>
</div>
