<script lang="ts">
    import type { ReviewInfo } from '../types/reviewInfo';

    export let info: ReviewInfo;
</script>

<li class="list-row flex items-center justify-between border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-600">
    <div class="flex items-center gap-3">
        <h1>{info.user_id}</h1>
        <div class="rating justify-center">
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="1 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="2 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="3 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="4 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-primary" aria-label="5 star" />
        </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-2 md:gap-6 lg:gap-6 lg:text-2xl md:text-lg sm:text-md text-md">
        <p>Review</p>
    </div>
</li>