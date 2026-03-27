<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../supabase';
  import { userID, userEmail, username } from '../stores/user';
  import { push } from 'svelte-spa-router';

  // --- Profile State ---
  let createdAt = '';
  let isPublic = false;
  let mcID = ''; // Placeholder for Minecraft User ID
  let avatarUrl = "src/assets/steve.jpg";

  // --- Editing States for each section ---
  let editStates = {
    username: false,
    mcID: false,
    email: false,
    password: false,
    visibility: false,
    memberSince: false
  };

  // --- Values for editing ---
  let editValues = {
    username: '',
    email: '',
    password: '',
    visibility: false,
    memberSince: ''
  };

  // --- Feedback Messages ---
  let messages = {
    username: { text: '', type: '' },
    mcID: { text: '', type: '' },
    email: { text: '', type: '' },
    password: { text: '', type: '' },
    visibility: { text: '', type: '' },
    memberSince: { text: '', type: '' }
  };

  let isLoading = false;
  let isLoggingOut = false;
  let showPassword = false;

  onMount(async () => {
    if (!$userID) {
      push('/login');
      return;
    }
    await fetchProfile();
    editValues.email = $userEmail;
    editValues.username = $username;
    editValues.visibility = isPublic;
    editValues.memberSince = createdAt;
  });

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, is_public, created_at')
      .eq('id', $userID)
      .single();

    if (data) {
      if (data.username) username.set(data.username);
      isPublic = data.is_public ?? false;
      if (data.created_at) {
        const date = new Date(data.created_at);
        createdAt = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }
  }

  function setMessage(section: keyof typeof messages, text: string, type: 'success' | 'error') {
    messages[section] = { text, type };
    setTimeout(() => {
      messages[section] = { text: '', type: '' };
    }, 5000);
  }

  async function updateField(section: keyof typeof editStates) {
    isLoading = true;
    try {
      if (section === 'username') {
        const { error } = await supabase
          .from('profiles')
          .update({ username: editValues.username })
          .eq('id', $userID);
        if (error) throw error;
        username.set(editValues.username);
        setMessage('username', 'Updated!', 'success');
      }
      else if (section === 'email') {
        const { error } = await supabase.auth.updateUser({ email: editValues.email });
        if (error) throw error;
        setMessage('email', 'Verification sent!', 'success');
      }
      else if (section === 'password') {
        if (!editValues.password) throw new Error("Password cannot be empty");
        const { error } = await supabase.auth.updateUser({ password: editValues.password });
        if (error) throw error;
        editValues.password = '';
        setMessage('password', 'Password updated!', 'success');
      }
      else if (section === 'visibility') {
        const { error } = await supabase
          .from('profiles')
          .update({ is_public: editValues.visibility })
          .eq('id', $userID);
        if (error) throw error;
        isPublic = editValues.visibility;
        setMessage('visibility', 'Updated!', 'success');
      }
      else if (section === 'mcID') {
        // Functionality not needed yet as per instructions
        setMessage('mcID', 'Saved (Draft)', 'success');
      }

      editStates[section] = false;
    } catch (error: any) {
      setMessage(section, error.message || 'Error updating', 'error');
    } finally {
      isLoading = false;
    }
  }

  async function logout() {
    isLoggingOut = true;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    } else {
      push('/home');
    }
    isLoggingOut = false;
  }

  function toggleEdit(section: keyof typeof editStates) {
    editStates[section] = !editStates[section];
    if (editStates[section]) {
      // Sync values when opening
      if (section === 'username') editValues.username = $username;
      if (section === 'email') editValues.email = $userEmail;
      if (section === 'visibility') editValues.visibility = isPublic;
    }
  }
</script>

<div class="mx-auto max-w-6xl px-6 md:px-10 select-none pb-20 pt-25 md:pt-30">
  <!-- Header Section -->
  <div class="mb-12 text-center">
    <h1 class="lg:text-4xl md:text-3xl text-2xl font-bold">Account Settings</h1>
    <p class="mt-4 text-sm md:text-md text-stone-400">Modify your avatar, username, and personal information.</p>
  </div>

  <div class="flex flex-col gap-8 items-center">

    <div class="flex flex-row items-center gap-5">
      <div class="relative group">
        <div class="w-15 h-15 md:w-20 md:h-20 rounded-2xl border-3 border-neutral bg-zinc-800 flex items-center justify-center overflow-hidden drop-shadow-2xl">
          <img src={avatarUrl} alt="Avatar" class="w-full h-full object-cover" />
        </div>
        <button
          class="absolute bottom-1 right-1 text-white hover:cursor-pointer"
          on:click={() => toggleEdit('mcID')}
          aria-label="Edit Avatar/MCID"
        >
          <i class="fa-solid fa-pen md:text-lg text-sm hover:text-primary transition-colors"></i>
        </button>
      </div>

      <!-- MCID Input Prompt (Visible when editing mcID) -->
      <!-- {#if editStates.mcID}
        <div class="w-full max-w-xs animate-in fade-in slide-in-from-top-2">
          <label class="block text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Minecraft User ID</label>
          <div class="flex gap-2">
            <input
              bind:value={mcID}
              type="text"
              placeholder="Enter MC UUID"
              class="input input-sm input-bordered bg-black/20 focus:border-primary w-full"
            />
            <button class="btn btn-sm btn-primary" on:click={() => updateField('mcID')}>Save</button>
          </div>
          {#if messages.mcID.text}
            <p class={`text-[10px] mt-1 ${messages.mcID.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.mcID.text}</p>
          {/if}
        </div>
      {/if} -->

      <!-- User Info -->
      <div class="w-full space-y-2">
        {#if editStates.username}
          <div class="flex gap-2 items-center">
            <input
              bind:value={editValues.username}
              class="input input-bordered bg-black/20 focus:border-primary w-full text-xl font-bold h-10"
            />
            <button class="btn btn-sm btn-square btn-primary" on:click={() => updateField('username')}>
              <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn btn-sm btn-square btn-ghost" on:click={() => toggleEdit('username')}>
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        {:else}
          <div class="flex items-center gap-3 justify-center group">
            <h2 class="text-xl md:text-2xl font-bold">{$username}</h2>
            <button
              class="text-stone-500 hover:text-primary"
              on:click={() => toggleEdit('username')}
            >
              <i class="fa-solid fa-pen text-sm hover:cursor-pointer"></i>
            </button>
          </div>
        {/if}
        <p class="text-stone-400 text-sm md:text-md">{$userEmail}</p>
        {#if messages.username.text}
          <p class={`text-xs mt-1 ${messages.username.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.username.text}</p>
        {/if}
      </div>
    </div>

    <!-- Main Content / Right Column -->
    <div class="lg:w-2/3 space-y-10">
      <!-- <div class="text-left">
        <h3 class="text-xl md:text-2xl font-bold">Personal Information</h3>
        <p class="mt-2 text-sm text-stone-400">Manage your sensitive account information and how your profile visibility.</p>
      </div> -->

      <!-- Info Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Email Card -->
        <div class="relative bg-gradient-to-tr from-black to-zinc-700 rounded-xl p-6 border-1 border-neutral drop-shadow-xl min-h-[140px] flex flex-col justify-between overflow-hidden">
          <div>
            <div class="flex items-center gap-3">
              <label class="text-md md:text-lg">Email Address</label>
              <i class="fa-solid fa-envelope text-primary text-md md:text-lg"></i>
            </div>
            {#if editStates.email}
              <input
                bind:value={editValues.email}
                type="email"
                class="input input-sm input-bordered bg-black/20 focus:border-primary w-full mt-2"
              />
              <div class="flex gap-2 mt-2">
                <button class="btn btn-xs btn-primary" on:click={() => updateField('email')}>Update</button>
                <button class="btn btn-xs btn-ghost" on:click={() => toggleEdit('email')}>Cancel</button>
              </div>
              {#if messages.email.text}
                <p class={`text-[10px] mt-1 ${messages.email.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.email.text}</p>
              {/if}
            {:else}
              <p class="mt-2 text-md text-stone-400 text-left">{$userEmail}</p>
            {/if}
          </div>
          <button
            class="absolute bottom-4 right-4 text-stone-500 hover:text-primary hover:cursor-pointer transition-colors"
            on:click={() => toggleEdit('email')}
          >
            <i class="fa-solid fa-pen text-sm"></i>
          </button>
        </div>

        <!-- Password Card -->
        <div class="relative bg-gradient-to-tr from-black to-zinc-700 rounded-xl p-6 border-1 border-neutral drop-shadow-xl min-h-[140px] flex flex-col justify-between overflow-hidden">
          <div>
            <div class="flex items-center gap-3">
              <label class="text-md md:text-lg">Password</label>
              <i class="fa-solid fa-key text-primary text-md md:text-lg"></i>
            </div>
            {#if editStates.password}
              <input
                bind:value={editValues.password}
                type="password"
                placeholder="New password"
                class="input input-sm input-bordered bg-black/20 focus:border-primary w-full mt-2"
              />
              <div class="flex gap-2 mt-2">
                <button class="btn btn-xs btn-primary" on:click={() => updateField('password')}>Change</button>
                <button class="btn btn-xs btn-ghost" on:click={() => toggleEdit('password')}>Cancel</button>
              </div>
              {#if messages.password.text}
                <p class={`text-[10px] mt-1 ${messages.password.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.password.text}</p>
              {/if}
            {:else}
              <p class="mt-2 text-md text-stone-400 tracking-widest text-left">•••••••••••••••</p>
            {/if}
          </div>
          <button
            class="absolute bottom-4 right-4 text-stone-500 hover:text-primary hover:cursor-pointer transition-colors"
            on:click={() => toggleEdit('password')}
          >
            <i class="fa-solid fa-pen text-sm"></i>
          </button>
        </div>

        <!-- Visibility Card -->
        <div class="relative bg-gradient-to-tr from-black to-zinc-700 rounded-xl p-6 border-1 border-neutral drop-shadow-xl min-h-[140px] flex flex-col justify-between overflow-hidden">
          <div>
            <div class="flex items-center gap-3">
              <label class="text-md md:text-lg">Profile Visibility</label>
              <i class={`fa-solid ${isPublic ? 'fa-globe' : 'fa-lock'} text-primary text-md md:text-lg`}></i>
            </div>
            {#if editStates.visibility}
              <div class="flex items-center gap-4 mt-3">
                <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={editValues.visibility} />
                <span class="text-xs text-stone-400">{editValues.visibility ? 'Public' : 'Private'}</span>
              </div>
              <div class="flex gap-2 mt-3">
                <button class="btn btn-xs btn-primary" on:click={() => updateField('visibility')}>Save</button>
                <button class="btn btn-xs btn-ghost" on:click={() => toggleEdit('visibility')}>Cancel</button>
              </div>
              {#if messages.visibility.text}
                <p class={`text-[10px] mt-1 ${messages.visibility.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.visibility.text}</p>
              {/if}
            {:else}
              <p class="mt-2 text-md text-stone-400 text-left">{isPublic ? 'Public' : 'Private'}</p>
            {/if}
          </div>
          <button
            class="absolute bottom-4 right-4 text-stone-500 hover:text-primary hover:cursor-pointer transition-colors"
            on:click={() => toggleEdit('visibility')}
          >
            <i class="fa-solid fa-pen text-sm"></i>
          </button>
        </div>

        <!-- Member Since Card -->
        <div class="relative bg-gradient-to-tr from-black to-zinc-700 rounded-xl p-6 border-1 border-neutral drop-shadow-xl min-h-[140px] flex flex-col justify-between overflow-hidden">
          <div>
            <div class="flex items-center gap-3">
              <label class="text-md md:text-lg">Member Since</label>
              <i class="fa-solid fa-calendar-days text-primary text-md md:text-lg"></i>
            </div>
            <p class="mt-2 text-md text-stone-400 text-left">{createdAt || 'Loading...'}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  /* Subtle glass effects and transitions */
  .drop-shadow-2xl {
    filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.45));
  }
</style>
