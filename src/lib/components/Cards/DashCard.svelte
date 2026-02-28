<script lang="ts">
    import { push } from 'svelte-spa-router';

    export let path: string;
    export let title: string;
    export let description: string;

    export function goTo() {
      push(`/${path}`);
    }
</script>

<div class="card card-lg w-96 bg-gradient-to-tr from-black to-zinc-700 drop-shadow-xl/80 border-1 border-neutral">
    <div class="card-body text-balance">
      <h2 class="card-title text-xl select-none justify-center">{title}</h2>
      <p class="text-center select-none mt-3 text-stone-400">{description}</p>
      <div class="card-actions mt-5 justify-center">
        <button on:click={() => goTo()} class="drop-shadow-xl/80 btn btn-primary btn-lg hover:scale-105 transition duration-200">Launch</button>
      </div>
    </div>
</div>