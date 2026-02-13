<script lang="ts">
  import { supabase } from '../supabase';
  import { isLoggedIn } from '../stores/login';
  import { onDestroy, onMount } from 'svelte';
  import { location } from 'svelte-spa-router';

  let navMenuOpen = false;
  let navDropdownEl: HTMLDivElement | null = null;

  let accountMenuOpen = false;
  let accountDropdownEl: HTMLDivElement | null = null;

  function isActivePath(path: string) {
    const currentPath = $location || '/';
    return currentPath === path;
  }

  function closeNavMenu() {
    navMenuOpen = false;
  }

  function closeAccountMenu() {
    accountMenuOpen = false;
  }

  function onDocumentClick(e: MouseEvent) {
    const target = e.target as Node | null;
    if (!target) return;

    if (navMenuOpen && navDropdownEl && !navDropdownEl.contains(target)) closeNavMenu();
    if (accountMenuOpen && accountDropdownEl && !accountDropdownEl.contains(target)) closeAccountMenu();
  }

  async function logout() {
      isLoggedIn.set(false);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error);
        return;
      }
  }

  onMount(() => {
  });

  onDestroy(() => {
    document.removeEventListener('click', onDocumentClick);
  });

  $: {
    document.removeEventListener('click', onDocumentClick);
    if (navMenuOpen || accountMenuOpen) document.addEventListener('click', onDocumentClick);
  }
</script>

<div class="navbar glass bg-gradient-to-tr from-black/50 to-zinc-700/50 h-15 grow left-1/2 -translate-x-1/2 top-0 z-50 fixed justify-center px-6 gap-4 sm:gap-8 md:gap-16 xl:gap-32 2xl:gap-80">
    <div class="navbar-start flex-none w-auto">
      <div class="relative" bind:this={navDropdownEl}>
        <button
          type="button"
          class="btn btn-primary btn-ghost"
          aria-label="Navigation menu"
          aria-haspopup="menu"
          aria-expanded={navMenuOpen}
          on:click|stopPropagation={() => (navMenuOpen = !navMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
        </button>
        {#if $isLoggedIn}
          {#if navMenuOpen}
          <ul
            class="menu menu-sm absolute left-0 glass bg-gradient-to-tr from-black/80 to-zinc-700/80 rounded-box z-50 mt-3 w-max whitespace-nowrap p-2 -mx-2 shadow-2xl">
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-center"
                class:bg-primary={isActivePath('/')}
                class:text-primary-content={isActivePath('/')}
                href="#/"
                on:click={closeNavMenu}>Dashboard</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-center"
                class:bg-primary={isActivePath('/status')}
                class:text-primary-content={isActivePath('/status')}
                href="#/status"
                on:click={closeNavMenu}>Server Status</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary"
                class:bg-primary={isActivePath('/explore')}
                class:text-primary-content={isActivePath('/explore')}
                href="#/explore"
                on:click={closeNavMenu}>Explore Servers</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-center"
                class:bg-primary={isActivePath('/profiles')}
                class:text-primary-content={isActivePath('/profiles')}
                href="#/profiles"
                on:click={closeNavMenu}>User Profiles</a>
            </li>
          </ul>
          {/if}
        {:else}
          {#if navMenuOpen}
          <ul
            class="menu menu-sm absolute left-0 glass bg-gradient-to-tr from-black/80 to-zinc-700/80 rounded-box z-50 mt-3 w-max whitespace-nowrap p-2 -mx-2 shadow-2xl">
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary"
                class:bg-primary={isActivePath('/home')}
                class:text-primary-content={isActivePath('/home')}
                href="#/home"
                on:click={closeNavMenu}>Home</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary"
                class:bg-primary={isActivePath('/about')}
                class:text-primary-content={isActivePath('/about')}
                href="#/about"
                on:click={closeNavMenu}>About</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary"
                class:bg-primary={isActivePath('/contact')}
                class:text-primary-content={isActivePath('/contact')}
                href="#/contact"
                on:click={closeNavMenu}>Contact</a>
            </li>
          </ul>
          {/if}
        {/if}
      </div>
    </div>
    <div class="navbar-center flex-none w-auto">
      {#if $isLoggedIn}
        <a
          class="btn btn-primary btn-ghost text-2xl flex items-center"
          href="#/"
          on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img
            src="/server_nexus.ico"
            alt="Server Nexus logo"
            class="w-10 h-10"
            draggable="false" />
          <span>Server Nexus</span>
        </a>
      {:else}
        <a
          class="btn btn-primary btn-ghost text-2xl flex items-center"
          href="#/"
          on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img
            src="/server_nexus.ico"
            alt="Server Nexus logo"
            class="w-10 h-10"
            draggable="false" />
          <span>Server Nexus</span>
        </a>
      {/if}
    </div>
    <div class="navbar-end flex-none w-auto">
      <div class="relative" bind:this={accountDropdownEl}>
        <button
          type="button"
          class="btn btn-primary btn-ghost"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={accountMenuOpen}
          on:click|stopPropagation={() => (accountMenuOpen = !accountMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
        </button>
        {#if $isLoggedIn}
          {#if accountMenuOpen}
          <ul
            class="menu menu-sm absolute right-0 glass bg-gradient-to-tr from-black/80 to-zinc-700/80 rounded-box z-50 mt-3 w-max whitespace-nowrap p-2 -mx-2 shadow-2xl text-right">
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-end"
                class:bg-primary={isActivePath('/account')}
                class:text-primary-content={isActivePath('/account')}
                href="#/account"
                on:click={closeAccountMenu}>Account</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-center"
                class:bg-primary={isActivePath('/about')}
                class:text-primary-content={isActivePath('/about')}
                href="#/about"
                on:click={closeAccountMenu}>About</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-center"
                class:bg-primary={isActivePath('/contact')}
                class:text-primary-content={isActivePath('/contact')}
                href="#/contact"
                on:click={closeAccountMenu}>Contact</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-end"
                on:click={(e) => {
                  closeAccountMenu();
                  logout();
                }}
                href="#/home">Log Out</a>
            </li>
          </ul>
          {/if}
        {:else}
          {#if accountMenuOpen}
          <ul
            class="menu menu-sm absolute right-0 glass bg-gradient-to-tr from-black/80 to-zinc-700/80 rounded-box z-50 mt-3 w-max whitespace-nowrap p-2 -mx-2 shadow-2xl text-right">
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-center"
                class:bg-primary={isActivePath('/login')}
                class:text-primary-content={isActivePath('/login')}
                href="#/login"
                on:click={closeAccountMenu}>Log In</a>
            </li>
            <li>
              <a
                class="text-xl whitespace-nowrap hover:bg-primary justify-end"
                class:bg-primary={isActivePath('/signup')}
                class:text-primary-content={isActivePath('/signup')}
                href="#/signup"
                on:click={closeAccountMenu}>Sign Up</a>
            </li>
          </ul>
          {/if}
        {/if}
      </div>
    </div>
</div>

