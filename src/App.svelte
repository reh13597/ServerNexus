<script lang="ts">
  import Router, { push } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
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
  import Profile from './lib/components/Profile.svelte';
  import ProfileStatus from './lib/pages/profiles/profile/ProfileStatus.svelte';
  import Stats from './lib/pages/profiles/profile/Stats.svelte';
  import Chat from './lib/pages/profiles/profile/Chat.svelte';
  import Map from './lib/pages/profiles/profile/Map.svelte';

  import Navbar from './lib/components/Navbar.svelte';
  import ProfileNav from './lib/components/ProfileNav.svelte';
  import { isLoggedIn } from './lib/stores/login';
  import { profile } from './lib/stores/profiles';

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type === 'signup') {
      push('/login');
      window.history.replaceState({}, '', window.location.pathname);
    }
  });

  const profilePages = ['/profile', '/profile-status', '/chat', '/stats', '/map'];

  function handleRoute(event: RouteLoadedEvent) {
    if (!profilePages.includes(event.detail.location)) {
      $profile = false;
    }
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
    '/profile': Profile,
    '/profile-status': ProfileStatus,
    '/chat': Chat,
    '/stats': Stats,
    '/map': Map,
  };
</script>

<Navbar />
{#if $profile}
  <ProfileNav />
{/if}

<main>
  <Router {routes} on:routeLoaded={handleRoute}/>
</main>


