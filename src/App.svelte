<script lang="ts">
  import Router, { push } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';

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
  import Stats from './lib/pages/profiles/profile/Stats.svelte';
  import Chat from './lib/pages/profiles/profile/Chat.svelte';
  import Maps from './lib/pages/profiles/profile/Maps.svelte';

  import Navbar from './lib/components/Navbar.svelte';
  import { isLoggedIn } from './lib/stores/login';

  onMount(() => {
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
    '/chat': Chat,
    '/stats': Stats,
    '/maps': Maps,
  };
</script>

<Navbar />
<main>
  <Router {routes}/>
</main>


