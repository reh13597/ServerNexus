<script lang="ts">
  import type { ServerProfile } from '../../types/serverInfo';
  import type { ReviewInfo } from '../../types/reviewInfo';
  import { userID, username } from '../../stores/user';
  import ReviewElement from './ReviewElement.svelte';
  import { supabase } from '../../supabase';
  import { onDestroy } from 'svelte';

  export let profile: ServerProfile;
  let reviews: ReviewInfo[] = [];
  let selectedRating = 0;
  let reviewText = '';
  let isSubmitting = false;
  let submitError = false;
  let submitSuccess = false;
  let emptyList = false;
  let channel: ReturnType<typeof supabase.channel> | null = null;

  $: isFormValid = selectedRating > 0 && reviewText.trim().length >= 40;
  $: charsRemaining = Math.max(0, 40 - reviewText.trim().length);

  $: if (profile?.id) {
    fetchReviews();
    setupRealtime();
  }

  async function fetchReviews() {
    const { data } = await supabase
        .from('reviews')
        .select(`*, profiles!reviews_user_id_fkey(username, avatar)`)
        .eq('server_id', profile.id);

    if (data) {
        reviews = data.map(r => ({
            ...r,
            username: r.profiles?.username ?? 'Unknown',
            avatar: r.profiles?.avatar ?? null,
        }));

        emptyList = reviews.length === 0;
    }
  }

  async function setupRealtime() {
    if (channel) {
      supabase.removeChannel(channel);
    }

    await supabase.realtime.setAuth();

    channel = supabase
      .channel(`reviews:${profile.id}`, {
        config: { private: true },
      })
      .on('broadcast', { event: 'INSERT' }, () => fetchReviews())
      .on('broadcast', { event: 'UPDATE' }, () => fetchReviews())
      .on('broadcast', { event: 'DELETE' }, () => fetchReviews())
      .subscribe();
  }

  async function broadcastUpdate() {
    await channel?.send({
      type: 'broadcast',
      event: 'reviews-updated',
      payload: {},
    });
  }

  onDestroy(() => {
    if (channel) {
      supabase.removeChannel(channel);
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
          username: $username,
          server_id: profile.id,
          rating: selectedRating,
          review: reviewText.trim(),
        });

      if (error) {
        console.error('Error submitting review:', error);
        submitError = true;
        selectedRating = 0;
        reviewText = '';
        setTimeout(() => submitError = false, 6000);
      } else {
        submitError = false;
        submitSuccess = true;
        selectedRating = 0;
        reviewText = '';
        setTimeout(() => submitSuccess = false, 6000);
        await broadcastUpdate();
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

<div class="flex flex-col w-full xl:flex-row gap-10 justify-between">
  <ul class="drop-shadow-xl/80 list border-1 border-neutral p-5 bg-gradient-to-tr from-black to-zinc-800 rounded-box xl:min-w-lg h-[60vh] overflow-y-auto space-y-5">
    {#if emptyList}
      <div class="p-5 rounded-box glass bg-gradient-to-tl from-base-100 to-zinc-600 text-sm md:text-md lg:text-lg text-left">
        Looks kind of empty here... leave a review here!
      </div>
    {:else}
      {#each reviews as review}
        <ReviewElement info={review} onDeleted={(id) => { reviews = reviews.filter(r => r.id !== id); broadcastUpdate(); }} />
      {/each}
    {/if}
  </ul>

  <div class="flex flex-col gap-5 flex-1">
    <div>
      <h1 class="text-sm md:text-md lg:text-lg">Rate & Review the server</h1>
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
      class="drop-shadow-xl/80 btn btn-primary w-full hover:scale-103 transition duration-200"
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
