<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../supabase';
  import { userID, userEmail, username } from '../stores/user';
  import { push } from 'svelte-spa-router';

  let isEditing = false;
  let isPublic = false;
  let createdAt = '';
  let newEmail = '';
  let newPassword = '';
  let showPassword = false;
  let isLoading = false;
  let message = '';
  let messageType: 'success' | 'error' = 'success';

  onMount(async () => {
    if (!$userID) {
      push('/login');
      return;
    }

    newEmail = $userEmail;
    await fetchProfile();
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
        createdAt = new Date(data.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }
  }

  async function updateProfile() {
    isLoading = true;
    message = '';

    try {
      // 1. Update Profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: $userID,
          username: $username,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // 2. Update Email if changed
      if (newEmail !== $userEmail) {
        const { error: emailError } = await supabase.auth.updateUser({ email: newEmail });
        if (emailError) throw emailError;
        message = 'Verification email sent! Please check your new email.';
        messageType = 'success';
      } else if (!newPassword) {
        message = 'Profile updated successfully!';
        messageType = 'success';
      }

      // 3. Update Password if provided
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
        if (passwordError) throw passwordError;
        newPassword = '';
        message = 'Profile and password updated successfully!';
        messageType = 'success';
      }

      if (messageType === 'success') {
        isEditing = false;
        await fetchProfile();
      }
    } catch (error: any) {
      console.error('Update error:', error);
      message = error.message || 'An error occurred during update.';
      messageType = 'error';
    } finally {
      isLoading = false;
      setTimeout(() => message = '', 5000);
    }
  }

  function togglePassword() {
    showPassword = !showPassword;
  }

  function cancelEdit() {
    isEditing = false;
    newEmail = $userEmail;
    newPassword = '';
    fetchProfile();
  }
</script>

<div class="mx-auto max-w-4xl px-10 select-none pb-20 pt-25 md:pt-30 text-center">
  <div class="mb-10">
    <h1 class="lg:text-4xl md:text-3xl text-2xl font-bold">Account</h1>
    <p class="mt-5 text-sm md:text-md text-stone-400">Modify your account details such as username, email, password, and more.</p>
  </div>

  <div class="relative bg-gradient-to-tr from-black to-zinc-700 rounded-xl p-8 md:p-12 drop-shadow-xl border-1 border-neutral overflow-hidden text-left min-h-[500px]">

    {#if !isEditing}
      <!-- Display View -->
      <button
        class="absolute top-6 right-6 p-2 text-stone-400 hover:text-primary transition-colors duration-200 z-10"
        on:click={() => isEditing = true}
        aria-label="Edit Profile"
      >
        <i class="fa-solid fa-pen-to-square text-xl"></i>
      </button>

      <div class="space-y-10">
        <div class="flex items-center gap-6 justify-center md:justify-start">
          <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-neutral bg-zinc-800 flex items-center justify-center overflow-hidden">
            <img src="src/assets/steve.jpg" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div>
            <h2 class="text-2xl md:text-3xl font-bold">{$username}</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 pt-4">
          <div class="text-left">
            <label class="block text-sm font-semibold mb-2 text-primary" for="display-email">Email address</label>
            <p class="text-md md:text-lg flex items-center gap-3">
              <i class="fa-solid fa-envelope text-stone-400"></i>
              {$userEmail}
            </p>
          </div>
          <div class="text-left">
            <label class="block text-sm font-semibold mb-2 text-primary" for="display-visibility">Profile visibility</label>
            <p class="text-md md:text-lg flex items-center gap-3">
              <i class={`fa-solid ${isPublic ? 'fa-globe text-success' : 'fa-lock text-warning'}`}></i>
              {isPublic ? 'Public' : 'Private'}
            </p>
          </div>
          <div class="text-left">
            <label class="block text-sm font-semibold mb-2 text-primary" for="display-password">Password</label>
            <p class="text-md md:text-lg flex items-center gap-3">
                <i class="fa-solid fa-key text-stone-400"></i>
                <span>••••••••••••</span>
            </p>
          </div>
          <div class="text-left">
            <label class="block text-sm font-semibold mb-2 text-primary" for="display-age">Member since</label>
            <p class="text-md md:text-lg flex items-center gap-3">
              <i class="fa-solid fa-calendar-days text-stone-400"></i>
              {createdAt || 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Edit View -->
      <form on:submit|preventDefault={updateProfile}>
        <button
          type="button"
          class="absolute top-6 right-6 btn btn-ghost btn-sm text-stone-400 hover:text-white z-10"
          on:click={cancelEdit}
        >
          Cancel
        </button>

        <div class="space-y-10">
          <div class="flex items-center gap-6 justify-center md:justify-start">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-neutral bg-zinc-800 flex items-center justify-center overflow-hidden">
              <img src="src/assets/steve.jpg" alt="Avatar" class="w-full h-full object-cover" />
            </div>
            <div class="w-full max-w-xs">
              <label class="block text-sm font-semibold mb-2 text-primary" for="username">Username</label>
              <input
                id="username"
                type="text"
                bind:value={$username}
                class="input input-bordered bg-base-300 focus:border-primary w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 pt-4">
            <div class="text-left">
              <label class="block text-sm font-semibold mb-2 text-primary" for="email">Email address</label>
              <input
                id="email"
                type="email"
                bind:value={newEmail}
                class="input input-bordered bg-base-300 focus:border-primary w-full"
              />
            </div>
            <div class="text-left">
              <label class="block text-sm font-semibold mb-2 text-primary" for="is_public">Profile visibility</label>
              <div class="flex items-center gap-4 h-12">
                <input id="is_public" type="checkbox" class="toggle toggle-primary" bind:checked={isPublic} />
                <span class="text-sm text-stone-400">{isPublic ? 'Public' : 'Private'}</span>
              </div>
            </div>
            <div class="text-left">
              <label class="block text-sm font-semibold mb-2 text-primary" for="password">Password</label>
              <div class="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  bind:value={newPassword}
                  class="input input-bordered bg-base-300 focus:border-primary w-full pr-12"
                  placeholder="Leave blank to keep current"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  on:click={togglePassword}
                >
                  <i class={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div class="text-left opacity-60">
              <label class="block text-sm font-semibold mb-2 text-primary" for="edit-age">Member since</label>
              <p class="text-md md:text-lg flex items-center gap-3 h-12">
                <i class="fa-solid fa-calendar-days text-stone-400"></i>
                {createdAt || 'Loading...'}
              </p>
            </div>
          </div>

          <div class="pt-8">
            <button
              type="submit"
              class="btn btn-primary w-full hover:scale-102 transition duration-200 shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {#if isLoading}
                <span class="loading loading-spinner loading-sm"></span> Saving...
              {:else}
                Save Changes
              {/if}
            </button>
          </div>
        </div>
      </form>
    {/if}
  </div>

  <!-- Messages -->
  {#if message}
    <div class="mt-8 flex justify-center">
      <div class={`alert ${messageType === 'success' ? 'bg-success/20 border-success/30 text-success' : 'bg-error/20 border-error/30 text-error'} border backdrop-blur-sm rounded-xl py-4 px-8 w-full shadow-xl flex items-center gap-4`}>
          <i class={`fa-solid ${messageType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <span class="text-sm font-medium">{message}</span>
      </div>
    </div>
  {/if}
</div>
