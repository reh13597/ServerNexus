<script lang="ts">
  import Router, { push } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import type { RouteLoadedEvent } from 'svelte-spa-router';
  import { supabase } from './lib/supabase'
  import { user } from './lib/stores/user';

  import Dashboard from './lib/pages/Dashboard.svelte';
  import About from './lib/pages/About.svelte';
  import Contact from './lib/pages/Contact.svelte';
  import Login from './lib/pages/Login.svelte';
  import Signup from './lib/pages/Signup.svelte';
  import Account from './lib/pages/Account.svelte';
  import Status from './lib/pages/Status.svelte';
  import PublicProfiles from './lib/pages/profiles/PublicProfiles.svelte';
  import PrivateProfiles from './lib/pages/profiles/PrivateProfiles.svelte';
  import Profile from './lib/pages/profiles/Profile.svelte';
  import ProfileStatus from './lib/components/profile/ProfileStatus.svelte';
  import Stats from './lib/components/profile/Stats.svelte';
  import Chat from './lib/components/profile/Chat.svelte';
  import Map from './lib/components/profile/Map.svelte';

  import Navbar from './lib/components/Navbar.svelte';
  import { isLoggedIn } from './lib/stores/login';
/*   import { profile } from './lib/stores/profiles'; */
  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type === 'signup') {
      push('/login');
      window.history.replaceState({}, '', window.location.pathname);
    }
  });

 /*  const profilePages = ['/profile', '/profile-status', '/chat', '/stats', '/map'];

  function handleRoute(event: RouteLoadedEvent) {
    if (!profilePages.includes(event.detail.location)) {
      $profile = false;
    }
  } */

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

    '/profile/:profileId': Profile,
    '/profile/:profileId/profile-status': ProfileStatus,
    '/profile/:profileId/chat': Chat,
    '/profile/:profileId/stats': Stats,
    '/profile/:profileId/map': Map,
  };
</script>

<Navbar />

<main>
  <Router {routes} />
<!-- on:routeLoaded={handleRoute} -->
</main>


