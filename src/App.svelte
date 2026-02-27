<script lang="ts">
  import { wrap } from 'svelte-spa-router/wrap';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import Router, { push } from 'svelte-spa-router';
  import type { RouteLoadedEvent } from 'svelte-spa-router';

  import { isLoggedIn, authReady } from './lib/stores/login';
  import { onProfile } from './lib/stores/profiles';

  import Dashboard from './lib/pages/Dashboard.svelte';
  import Home from './lib/pages/Home.svelte';
  import About from './lib/pages/About.svelte';
  import Contact from './lib/pages/Contact.svelte';
  import Login from './lib/pages/Login.svelte';
  import Signup from './lib/pages/Signup.svelte';
  import Account from './lib/pages/Account.svelte';
  import Status from './lib/pages/features/Status.svelte';
  import Explore from './lib/pages/features/Explore.svelte';
  import Profiles from './lib/pages/features/Profiles.svelte';
  import ServerInfo from './lib/pages/features/ServerInfo.svelte';

  import Navbar from './lib/components/Navbar.svelte';
  import Footer from './lib/components/Footer.svelte';

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type === 'signup') {
      push('/login');
      window.history.replaceState({}, '', window.location.pathname);
    }
  });

  const routes = {
    '/': wrap({
      component: Dashboard,
      conditions: [
        () => {
          if (!get(isLoggedIn)) {
            push('/home');
            return false;
          }
          return true;
        }
      ]
    }),
    '/login': wrap ({
      component: Login,
      conditions: [
        () => {
          if(get(isLoggedIn)) {
            push('/');
            return false;
          }
          return true;
        }
      ]
    }),
    '/home' : Home,
    '/about' : About,
    '/contact': Contact,
    '/signup' : Signup,
    '/account' : Account,
    '/status': Status,

    '/explore': Explore,
    '/profiles': Profiles,

    '/server-info/:serverId': ServerInfo
  };
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <main class="flex-1">
    {#if $authReady}
        <Router {routes} />
    {/if}
  </main>

  <Footer />
</div>


