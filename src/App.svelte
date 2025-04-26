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

  import Navbar from './lib/components/Navbar.svelte';
  import { isLoggedIn } from './lib/stores/login';

  onMount(() => {
    // Check if this is a redirect from email verification
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type === 'signup') {
      // If this is a signup verification, redirect to login
      push('/login');
    }
  });

  const routes = {
    '/': wrap({
      component: Dashboard,
      conditions: [
        () => {
          if (!get(isLoggedIn)) {
            push('/about')
            return false;
          }
          return true;
        }
      ]
    }),
    '/about': wrap ({
      component: About,
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
    '/contact': Contact,
    '/login' : Login,
    '/signup' : Signup,
    '/account' : Account,
  };
</script>

<Navbar />

<main>
  <Router {routes}/>
</main>
