<script lang="ts">
    import type { PublicProfile } from '../../types/profileInfo';
    import Steve from '../../../assets/steve.jpg';
    import { push } from 'svelte-spa-router';

    export let profile: PublicProfile;

    function goTo() {
        push(`/profile/${profile.id}`);
    }
</script>

<li class="drop-shadow-xl/80 list-row flex items-center justify-between border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
    <div class="flex items-center gap-2 md:gap-4">
        <div class="avatar">
            <div class="w-8 md:w-10 rounded">
                <img src={Steve} alt="User avatar" />
            </div>
        </div>
        <p class="text-xs md:text-lg lg:text-xl text-left">{profile.username}</p>
    </div>
    <div class="flex items-center gap-3 md:gap-6 lg:text-xl md:text-lg text-sm">
        <div class="flex items-center gap-1" title="Saved servers">
            <i class="fa-bookmark fa-solid text-primary"></i>
            <p class="select-none">{profile.saved_count}</p>
        </div>
        <div class="flex items-center gap-1" title="Reviews">
            <i class="fa-solid fa-comment-dots text-primary"></i>
            <p class="select-none">{profile.review_count}</p>
        </div>
        <a on:click={goTo} class="drop-shadow-xl/90 inline-flex w-fit hover:scale-115 transition duration-300 hover:cursor-pointer hover:text-primary" aria-label="View Profile">
            <i class="fa-arrow-right fa-solid"></i>
        </a>
    </div>
</li>
