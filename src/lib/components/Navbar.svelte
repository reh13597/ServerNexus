<script lang="ts">
  import { supabase } from '../supabase';
  import { isLoggedIn } from '../stores/login';
  import { onDestroy } from 'svelte';
  import { location, push } from 'svelte-spa-router';

  let accountMenuOpen = false;
  let accountDropdownEl: HTMLDivElement | null = null;
  let isLoggingOut = false;

  function openModal() {
        (document.getElementById(`logout_modal`) as HTMLDialogElement)?.showModal();
  }

    function closeModal() {
        (document.getElementById(`logout_modal`) as HTMLDialogElement)?.close();
  }

  function isActivePath(path: string) {
    const currentPath = $location || '/';
    return currentPath === path;
  }

  function isExploreActive() {
    const currentPath = $location || '/';
    return currentPath === '/explore' || currentPath.startsWith('/server-info');
  }

  function closeAccountMenu() {
    accountMenuOpen = false;
  }

  function onDocumentClick(e: MouseEvent) {
    const target = e.target as Node | null;
    if (!target) return;

    if (accountMenuOpen && accountDropdownEl && !accountDropdownEl.contains(target)) closeAccountMenu();
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error);
      isLoggingOut = false;
      closeModal();
      return;
    } else {
      isLoggingOut = true;
      isLoggedIn.set(false);
      closeModal();
      push('/home');
      isLoggingOut = false;
    }
  }

  onDestroy(() => {
    document.removeEventListener('click', onDocumentClick);
  });

  $: {
    document.removeEventListener('click', onDocumentClick);
    if (accountMenuOpen) document.addEventListener('click', onDocumentClick);
  }
</script>

<div class="navbar border-b border-neutral bg-black h-15 grow left-1/2 -translate-x-1/2 top-0 z-50 fixed justify-center px-6 gap-4 sm:gap-8 md:gap-16 xl:gap-32 2xl:gap-80">
  <div class="navbar-start flex-none w-auto">
    <a
      class="hover:text-primary transition-colors font-bold text-md md:text-xl flex items-center gap-2"
      href="#/"
      on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <img
        src="/server_nexus.ico"
        alt="Server Nexus logo"
        class="w-8 h-8 md:w-10 md:h-10 hover:animate-spin hover:[animation-duration:3s]"
        draggable="false" />
      <span>Server Nexus</span>
    </a>
  </div>

  <div class="navbar-end flex-none w-auto gap-4 sm:gap-6">
    {#if $isLoggedIn}
      <nav class="flex items-center gap-4 sm:gap-6 text-md md:text-lg">
        <a
          href="#/"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/')}
          class:text-primary={isActivePath('/')}>Home</a>
        <a
          href="#/status"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/status')}
          class:text-primary={isActivePath('/status')}>Status</a>
        <a
          href="#/explore"
          class="hover:text-primary transition-colors"
          class:text-white={!isExploreActive()}
          class:text-primary={isExploreActive()}>Explore</a>
        <a
          href="#/profiles"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/profiles')}
          class:text-primary={isActivePath('/profiles')}>Profiles</a>
        <a
          href="#/about"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/about')}
          class:text-primary={isActivePath('/about')}>About</a>
        <a
          href="#/contact"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/contact')}
          class:text-primary={isActivePath('/contact')}>Contact</a>
      </nav>
    {:else}
      <nav class="flex items-center gap-4 sm:gap-6 text-md md:text-lg">
        <a
          href="#/home"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/home')}
          class:text-primary={isActivePath('/home')}>Home</a>
        <a
          href="#/about"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/about')}
          class:text-primary={isActivePath('/about')}>About</a>
        <a
          href="#/contact"
          class="hover:text-primary transition-colors"
          class:text-white={!isActivePath('/contact')}
          class:text-primary={isActivePath('/contact')}>Contact</a>
      </nav>
    {/if}

    <div class="relative" bind:this={accountDropdownEl}>
      <a
        type="button"
        class="inline-flex w-fit hover:cursor-pointer hover:text-primary transition-colors"
        class:text-primary={isActivePath('/account') || isActivePath('/login') || isActivePath('/signup')}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={accountMenuOpen}
        on:click|stopPropagation={() => (accountMenuOpen = !accountMenuOpen)}>
          <i class="fa-regular fa-user text-md md:text-lg"></i>
      </a>
      {#if $isLoggedIn}
        {#if accountMenuOpen}
          <ul class="menu menu-sm absolute left-0 glass bg-gradient-to-tr from-black/90 to-zinc-700/90 rounded-box z-50 mt-5 w-max whitespace-nowrap p-2">
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-end"
                class:bg-primary={isActivePath('/account')}
                class:text-primary-content={isActivePath('/account')}
                href="#/account">Account</a>
            </li>

            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-end"
                on:click={() => { openModal(); }}
                >
                Log Out
              </a>
            </li>
          </ul>
        {/if}
      {:else}
        {#if accountMenuOpen}
          <ul class="menu menu-sm absolute left-0 glass bg-gradient-to-tr from-black/90 to-zinc-700/90 rounded-box z-50 mt-5 w-max whitespace-nowrap p-2">
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-center"
                class:bg-primary={isActivePath('/login')}
                class:text-primary-content={isActivePath('/login')}
                href="#/login">Log In</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-end"
                class:bg-primary={isActivePath('/signup')}
                class:text-primary-content={isActivePath('/signup')}
                href="#/signup">Sign Up</a>
            </li>
          </ul>
        {/if}
      {/if}
    </div>
  </div>
</div>

<dialog id="logout_modal" class="modal">
  <div class="modal-box flex flex-col gap-5 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700">
      <h3 class="text-lg font-bold"><span class="text-primary">Log out</span> of your account?</h3>
      <p class="py-4 text-stone-400 text-sm"><span class="text-primary">Caution:</span> You must log back in to access your account.</p>
      <div class="flex justify-center gap-3">
          <button class="btn btn-ghost border-1 border-gray-500 hover:bg-primary hover:scale-105 transition duration-200" on:click={closeModal} disabled={isLoggingOut}>Cancel</button>
          <button class="btn btn-primary hover:scale-105 transition duration-200" on:click={logout} disabled={isLoggingOut}>
              {#if isLoggingOut}
                  <span class="loading loading-spinner loading-xs"></span>
              {:else}
                  Log Out
              {/if}
          </button>
      </div>
  </div>
</dialog>