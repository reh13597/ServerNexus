<script lang="ts">
  import { wrap } from 'svelte-spa-router/wrap';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import Router, { push } from 'svelte-spa-router';
  import type { RouteLoadedEvent } from 'svelte-spa-router';

  import Dashboard from './lib/pages/Dashboard.svelte';
  import Home from './lib/pages/Home.svelte';
  import About from './lib/pages/About.svelte';
  import Contact from './lib/pages/Contact.svelte';
  import Login from './lib/pages/Login.svelte';
  import Signup from './lib/pages/Signup.svelte';
  import Account from './lib/pages/Account.svelte';
  import Status from './lib/pages/Status.svelte';
  import Explore from './lib/pages/Explore.svelte';
  import Profiles from './lib/pages/Profiles.svelte';
  import ServerInfo from './lib/pages/ServerInfo.svelte';

  import Navbar from './lib/components/Navbar.svelte';
  import { isLoggedIn, authReady } from './lib/stores/login';
  import { onProfile } from './lib/stores/profiles';

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type === 'signup') {
      push('/login');
      window.history.replaceState({}, '', window.location.pathname);
    }
  });

  const profilePages = ['/profile-status', '/chat', '/stats', '/map']

  function handleRoute(event: RouteLoadedEvent) {
    const currentPath = event.detail.location;

    const isProfilePage = profilePages.some((page) => currentPath.endsWith(page));

    $onProfile = isProfilePage;
  }

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

    '/:serverId/server-info': ServerInfo
  };
</script>

<div class="fixed inset-0 -z-10 bg-gradient-to-l from-base-100 via-stone-400 to-base-300 animate-gradient"></div>

<Navbar />

<main>
  {#if $authReady}
      <Router {routes} on:routeLoaded={handleRoute} />
  {/if}
</main>


