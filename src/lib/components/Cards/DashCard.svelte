<script lang="ts">
    import { push } from 'svelte-spa-router';

    export let path: string;
    export let title: string;
    export let description: string;

    export function goTo() {
      push(`/${path}`);
    }
</script>

<div class="card w-96 bg-base-100 card-xl shadow-sm">
    <div class="card-body">
      <h2 class="card-title justify-center">{title}</h2>
      <p>{description}</p>
      <div class="justify-center card-actions mt-5">
        <button on:click={() => goTo()} class="btn btn-primary btn-lg">Go!</button>
      </div>
    </div>
</div>