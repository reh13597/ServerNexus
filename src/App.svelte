<script lang="ts">
  import { wrap } from 'svelte-spa-router/wrap';
  import Router from 'svelte-spa-router';
  import Dashboard from './lib/pages/Dashboard.svelte';
  import About from './lib/pages/About.svelte';
  import Contact from './lib/pages/Contact.svelte';
  import Login from './lib/pages/Login.svelte';
  import Signup from './lib/pages/Signup.svelte';
  import Navbar from './lib/components/Navbar.svelte';

  const routes = {
    '/': Dashboard,
    '/about': About,
    '/contact': Contact,
    '/login' : Login,
    '/signup' : Signup
  };
</script>

<Navbar />
<main>
  <Router {routes} />
</main>
