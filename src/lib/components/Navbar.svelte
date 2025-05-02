<script lang="ts">
  import { supabase } from '../supabase';
  import { isLoggedIn } from '../stores/login';

  async function logout() {
      isLoggedIn.set(false);
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        console.log("Logout error occured.");
        return;
      }
  }
</script>

<div class="navbar h-20 bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0">
          <a class="btn btn-primary btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </a>
        </div>
        {#if $isLoggedIn}
          <ul
            class="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a class="text-xl" href="#/">Dashboard</a></li>
            <li><a class="text-xl" href="#/server-status">Server Status</a></li>
            <li><a class="text-xl" href="#/public-profiles">Public Profiles</a></li>
            <li><a class="text-xl" href="#/private-profiles">My Profiles</a></li>
          </ul>
        {:else}
          <ul
            class="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-28 p-2 shadow">
            <li><a class="text-xl" href="#/about">About</a></li>
            <li><a class="text-xl" href="#/contact">Contact</a></li>
          </ul>
        {/if}
      </div>
    </div>
    <div class="navbar-center">
      {#if $isLoggedIn}
        <a class="btn btn-primary btn-ghost text-2xl" href="#/">&#x1F517 SERVER NEXUS &#x2699</a>
      {:else}
        <a class="btn btn-primary btn-ghost text-2xl" href="#/about">&#x1F517 SERVER NEXUS &#x2699</a>
      {/if}
    </div>
    <div class="navbar-end">
      <div class="dropdown">
        <div tabindex="0">
          <a class="btn btn-primary btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
          </a>
        </div>
        {#if $isLoggedIn}
          <ul
            class="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-29 p-2 right-0.5 shadow">
            <li><a class="text-xl text-right" href="#/account">Account</a></li>
            <li><a class="text-xl text-right" href="#/account">About</a></li>
            <li><a class="text-xl text-right" href="#/account">Contact</a></li>
            <li><a on:click={logout} class="text-xl text-right" href="#/login">Log Out</a></li>
          </ul>
        {:else}
          <ul
            class="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-26 p-2 right-0.5 shadow">
            <li><a class="text-xl text-right" href="#/login">Log In</a></li>
          </ul>
        {/if}
      </div>
    </div>
</div>

