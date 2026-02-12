<script lang="ts">
    export let title: string;
    export let description: string;
</script>

<div class="card w-96 bg-gradient-to-tr from-black to-zinc-700 card-xl shadow-2xl">
    <div class="card-body text-balance">
      <h2 class="card-title text-2xl select-none justify-center">{title}</h2>
      <p class="text-center select-none mt-3 text-stone-400">{description}</p>
    </div>
</div>