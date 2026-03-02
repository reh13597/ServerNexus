<script lang="ts">
    export let iconClass: string;
    export let title: string;
    export let description: string;
</script>

<div class="drop-shadow-xl/100 card card-lg w-96 bg-gradient-to-tr from-black to-zinc-700 border-1 border-neutral">
    <div class="card-body text-balance flex flex-col items-center">
      <i class={`justify-center text-2xl text-primary ${iconClass}`}></i>
      <h2 class="card-title mt-3 text-xl select-none justify-center">{title}</h2>
      <p class="text-center select-none mt-3 text-stone-400">{description}</p>
    </div>
</div>