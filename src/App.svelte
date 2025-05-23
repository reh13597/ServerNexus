<script lang="ts">
  import { wrap } from 'svelte-spa-router/wrap';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import Router, { push } from 'svelte-spa-router';
  import type { RouteLoadedEvent } from 'svelte-spa-router';

  import Dashboard from './lib/pages/Dashboard.svelte';
  import About from './lib/pages/About.svelte';
  import Contact from './lib/pages/Contact.svelte';
  import Login from './lib/pages/Login.svelte';
  import Signup from './lib/pages/Signup.svelte';
  import Account from './lib/pages/Account.svelte';
  import Status from './lib/pages/Status.svelte';
  import PublicProfiles from './lib/pages/profiles/PublicProfiles.svelte';
  import PrivateProfiles from './lib/pages/profiles/PrivateProfiles.svelte';
  import ProfileStatus from './lib/components/profile/ProfileStatus.svelte';
  import Stats from './lib/components/profile/Stats.svelte';
  import Chat from './lib/components/profile/Chat.svelte';
  import Map from './lib/components/profile/Map.svelte';

  import Navbar from './lib/components/Navbar.svelte';
  import ProfileNav from './lib/components/profile/ProfileNav.svelte';
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
            push('/login')
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
    '/about' : About,
    '/contact': Contact,
    '/signup' : Signup,
    '/account' : Account,
    '/status': Status,

    '/public-profiles': PublicProfiles,
    '/private-profiles': PrivateProfiles,

    '/:profileId/profile-status': ProfileStatus,
    '/:profileId/chat': Chat,
    '/:profileId/stats': Stats,
    '/:profileId/map': Map,
  };
</script>

<Navbar />
{#if $onProfile}
  <ProfileNav />
{/if}

<main>
<!--   {#if $authReady} -->
    <Router {routes} on:routeLoaded={handleRoute} />
<!--   {/if} -->
</main>


