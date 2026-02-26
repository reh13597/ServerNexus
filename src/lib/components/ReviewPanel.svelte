<script lang="ts">
    import type { ServerProfile } from '../types/serverInfo';
    import type { ReviewInfo } from '../types/reviewInfo';
    import { userID } from '../stores/user';
    import ReviewElement from './ReviewElement.svelte';
    import { supabase } from '../supabase';
    import { onMount } from 'svelte';

    export let profile: ServerProfile;
    let emptyList = false;
    let reviews: ReviewInfo[] = [];

    let selectedRating = 0;
    let reviewText = '';
    let isSubmitting = false;
    let submitError = false;
    let submitSuccess = false;

    $: isFormValid = selectedRating > 0 && reviewText.trim().length >= 40;
    $: charsRemaining = Math.max(0, 40 - reviewText.trim().length);

    onMount(async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('reviews')
          .select('*')
          .eq('server_id', profile.id);

        if (fetchError) {
          console.error('Error fetching reviews:', fetchError);
          emptyList = true;
        } else if (data && data.length > 0) {
          reviews = data;
          emptyList = false;
        } else {
          emptyList = true;
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        emptyList = true;
      }
    });

    async function handleSubmit() {
      if (!isFormValid || isSubmitting) return;

      isSubmitting = true;
      submitError = false;

      try {
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: $userID,
            server_id: profile.id,
            rating: selectedRating,
            review: reviewText.trim(),
          });

        if (error) {
          console.error('Error submitting review:', error);
          submitError = true;
          selectedRating = 0;
          reviewText = '';
        } else {
          submitError = false;
          submitSuccess = true;
          selectedRating = 0;
          reviewText = '';

          const { data } = await supabase
            .from('reviews')
            .select(`*, profiles(username, avatar)`)
            .eq('server_id', profile.id);

            console.log('data:', data);
            console.log('error:', error);
          if (data) {
            reviews = data;
            emptyList = data.length === 0;
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        selectedRating = 0;
        reviewText = '';
      } finally {
        isSubmitting = false;
      }
    }
</script>

<div class="flex flex-col w-full xl:flex-row gap-10 mb-10 justify-between">
  <ul class="list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box max-h-[60vh] overflow-y-auto space-y-5">
    {#if emptyList}
      <div class="p-5 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-sm md:text-md lg:text-lg text-left">
        Looks kind of empty here... leave a review here!
      </div>
    {:else}
      {#each reviews as review}
        <ReviewElement info={review} />
      {/each}
    {/if}
  </ul>

  <div class="flex flex-col gap-5 flex-1">
    <div>
      <h1 class="text-sm md:text-md lg:text-lg">Rate & Review the server below</h1>
    </div>

    <div class="rating justify-center">
      {#each [1, 2, 3, 4, 5] as star}
        <input
          type="radio"
          name="rating-2"
          class="mask mask-star-2 bg-primary"
          aria-label="{star} star"
          value={star}
          checked={selectedRating === star}
          on:change={() => selectedRating = star}
        />
      {/each}
    </div>

    <div>
      <textarea
        id="message"
        name="message"
        rows="4"
        placeholder="Write your review here..."
        class="textarea textarea-bordered w-full mb-3 bg-base-300"
        bind:value={reviewText}
      ></textarea>
      {#if charsRemaining > 0 && !submitError}
        <p class="text-xs text-stone-400">{charsRemaining} more character{charsRemaining !== 1 ? 's' : ''} required</p>
      {/if}
      {#if submitError}
        <p class="text-error text-xs">Error: You can only submit one review per server.</p>
      {/if}
      {#if submitSuccess}
        <p class="text-success text-xs">Review submitted successfully!</p>
      {/if}
    </div>

    <button
      type="submit"
      class="btn btn-primary w-full hover:scale-103 transition duration-200"
      disabled={!isFormValid || isSubmitting}
      on:click={handleSubmit}
    >
    {#if isSubmitting}
      <span class="loading loading-spinner loading-sm"></span> Submitting...
    {:else}
      Submit Review
    {/if}
    </button>
  </div>
</div>
