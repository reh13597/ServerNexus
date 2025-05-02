<script lang="ts">
  let isOpen = true;
</script>

<div class="drawer lg:drawer-open relative">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={isOpen} />
  <div class="drawer-content flex flex-col min-h-[calc(100vh-5rem)] mt-20">
    <div class="flex justify-end p-4">
      <label for="my-drawer-2" class="btn btn-ghost drawer-button lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>
    </div>
    <slot />
  </div>
  <div class="drawer-side fixed top-20 left-0 h-[calc(100vh-5rem)]">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay top-20 bg-black/30"></label>
    <div class="menu bg-base-100 text-base-content min-h-full w-64 p-4 relative">
      <label for="my-drawer-2" class="btn btn-ghost btn-circle absolute -right-3 top-1/2 -translate-y-1/2 z-50">
        {#if isOpen}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        {/if}
      </label>
      <ul class="menu menu-lg gap-2">
        <li><a class="text-xl" href="#/server-status">Server Status</a></li>
        <li><a class="text-xl" href="#/public-profiles">Public Profiles</a></li>
        <li><a class="text-xl" href="#/private-profiles">My Profiles</a></li>
      </ul>
    </div>
  </div>
</div>