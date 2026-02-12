<script lang="ts">
    export let iconClass: string;
    export let title: string;
    export let description: string;
</script>

<div class="card w-96 bg-gradient-to-tr from-black to-zinc-700 card-xl shadow-2xl border-1 border-neutral">
    <div class="card-body text-balance flex flex-col items-center">
      <i class={`justify-center text-3xl text-primary hover:scale-115 transition duration-200 ${iconClass}`}></i>
      <h2 class="card-title mt-3 text-2xl select-none justify-center">{title}</h2>
      <p class="text-center select-none mt-3 text-stone-400">{description}</p>
    </div>
</div>