<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../supabase';
  import { userID, userEmail, username } from '../stores/user';
  import { push } from 'svelte-spa-router';

  // --- Profile State ---
  let createdAt = '';
  let isPublic = false;
  let avatarUrl = "src/assets/steve.jpg";
  let isEditing = false;

  // --- Values for editing ---
  let editValues = {
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    visibility: false
  };

  // --- Feedback Messages ---
  type FeedbackType = 'success' | 'error';

  let messages = {
    username: { text: '', type: '' as '' | FeedbackType },
    email: { text: '', type: '' as '' | FeedbackType },
    password: { text: '', type: '' as '' | FeedbackType },
    visibility: { text: '', type: '' as '' | FeedbackType }
  };

  type Toast = {
    id: number;
    text: string;
    type: FeedbackType;
  };

  let toasts: Toast[] = [];
  let toastId = 0;
  const pendingEmailStorageKey = 'account.pendingEmailChange';
  let pendingEmail = '';
  let isLoading = false;
  let isLoggingOut = false;
  let showCurrentPassword = false;
  let showNewPassword = false;
  let showConfirmPassword = false;

  onMount(async () => {
    if (!$userID) {
      push('/login');
      return;
    }
    await fetchProfile();
    editValues.email = $userEmail;
    editValues.username = $username;
    editValues.visibility = isPublic;
    refreshPendingEmail();
    checkEmailChangeCompletion();
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

  function setMessage(section: keyof typeof messages, text: string, type: FeedbackType) {
    messages[section] = { text, type };
    setTimeout(() => {
      messages[section] = { text: '', type: '' };
    }, 5000);
  }

  function pushToast(text: string, type: FeedbackType = 'success') {
    const id = ++toastId;
    toasts = [...toasts, { id, text, type }];

    setTimeout(() => {
      toasts = toasts.filter((toast) => toast.id !== id);
    }, 4000);
  }

  function getPendingEmailKey() {
    return `${pendingEmailStorageKey}.${$userID}`;
  }

  function refreshPendingEmail() {
    if (typeof window === 'undefined' || !$userID) return;
    pendingEmail = window.localStorage.getItem(getPendingEmailKey()) || '';
  }

  function storePendingEmail(nextEmail: string) {
    if (typeof window === 'undefined' || !$userID) return;
    window.localStorage.setItem(getPendingEmailKey(), nextEmail);
    pendingEmail = nextEmail;
  }

  function clearPendingEmail() {
    if (typeof window === 'undefined' || !$userID) return;
    window.localStorage.removeItem(getPendingEmailKey());
    pendingEmail = '';
  }

  function checkEmailChangeCompletion() {
    if (!pendingEmail || !$userEmail) return;
    if ($userEmail.toLowerCase() !== pendingEmail.toLowerCase()) return;

    clearPendingEmail();
    setMessage('email', 'Email address confirmed and updated.', 'success');
    pushToast('Email address updated successfully.', 'success');
  }

  function clearPasswordFields() {
    editValues.currentPassword = '';
    editValues.newPassword = '';
    editValues.confirmPassword = '';
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;
  }

  function syncEditValuesFromState() {
    editValues.username = $username;
    editValues.email = $userEmail;
    editValues.visibility = isPublic;
    clearPasswordFields();
  }

  function clearMessages() {
    messages.username = { text: '', type: '' };
    messages.email = { text: '', type: '' };
    messages.password = { text: '', type: '' };
    messages.visibility = { text: '', type: '' };
  }

  function startEditing() {
    syncEditValuesFromState();
    clearMessages();
    isEditing = true;
  }

  function cancelEditing() {
    syncEditValuesFromState();
    clearMessages();
    isEditing = false;
  }

  async function updateField(section: 'username' | 'email' | 'password' | 'visibility') {
    isLoading = true;
    try {
      if (section === 'username') {
        const nextUsername = editValues.username.trim();
        if (!nextUsername) throw new Error('Username cannot be empty.');
        if (nextUsername === $username) throw new Error('Username is unchanged.');

        const { error } = await supabase
          .from('profiles')
          .update({ username: nextUsername })
          .eq('id', $userID);
        if (error) throw error;
        editValues.username = nextUsername;
        username.set(nextUsername);
        setMessage('username', 'Username updated.', 'success');
        pushToast('Username updated successfully.', 'success');
      }
      else if (section === 'email') {
        const nextEmail = editValues.email.trim().toLowerCase();
        if (!nextEmail) throw new Error('Email cannot be empty.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) throw new Error('Enter a valid email address.');
        if (nextEmail === $userEmail.toLowerCase()) throw new Error('Email is unchanged.');

        const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;
        const { error } = await supabase.auth.updateUser({ email: nextEmail }, { emailRedirectTo });
        if (error) throw error;
        storePendingEmail(nextEmail);
        setMessage('email', 'Confirmation email sent to your new address.', 'success');
        pushToast('Confirmation email sent. Verify to finish email change.', 'success');
      }
      else if (section === 'password') {
        const currentPassword = editValues.currentPassword.trim();
        const newPassword = editValues.newPassword.trim();
        const confirmPassword = editValues.confirmPassword.trim();

        if (!currentPassword) throw new Error('Current password is required.');
        if (!newPassword) throw new Error('New password is required.');
        if (newPassword.length < 8) throw new Error('New password must be at least 8 characters.');
        if (newPassword !== confirmPassword) throw new Error('New password fields do not match.');
        if (currentPassword === newPassword) throw new Error('New password must differ from current password.');

        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: $userEmail,
          password: currentPassword
        });
        if (verifyError) throw new Error('Current password is incorrect.');

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        editValues.currentPassword = '';
        editValues.newPassword = '';
        editValues.confirmPassword = '';
        showCurrentPassword = false;
        showNewPassword = false;
        showConfirmPassword = false;
        setMessage('password', 'Password updated.', 'success');
        pushToast('Password updated successfully.', 'success');
      }
      else if (section === 'visibility') {
        if (editValues.visibility === isPublic) throw new Error('Visibility is unchanged.');

        const { error } = await supabase
          .from('profiles')
          .update({ is_public: editValues.visibility })
          .eq('id', $userID);
        if (error) throw error;
        isPublic = editValues.visibility;
        const visibilityLabel = isPublic ? 'Public' : 'Private';
        setMessage('visibility', `Profile visibility set to ${visibilityLabel}.`, 'success');
        pushToast(`Profile visibility changed to ${visibilityLabel}.`, 'success');
      }
    } catch (error: any) {
      setMessage(section, error.message || 'Error updating', 'error');
      throw error;
    } finally {
      isLoading = false;
    }
  }

  async function saveAllChanges() {
    clearMessages();
    let hasChanges = false;

    const nextUsername = editValues.username.trim();
    const nextEmail = editValues.email.trim().toLowerCase();
    const hasPasswordInput = Boolean(
      editValues.currentPassword.trim() ||
      editValues.newPassword.trim() ||
      editValues.confirmPassword.trim()
    );
    const visibilityChanged = editValues.visibility !== isPublic;

    try {
      if (nextUsername !== $username) {
        hasChanges = true;
        await updateField('username');
      }

      if (nextEmail && nextEmail !== $userEmail.toLowerCase()) {
        hasChanges = true;
        await updateField('email');
      }

      if (hasPasswordInput) {
        hasChanges = true;
        await updateField('password');
      }

      if (visibilityChanged) {
        hasChanges = true;
        await updateField('visibility');
      }

      if (!hasChanges) {
        pushToast('No changes to save.', 'error');
        return;
      }

      isEditing = false;
      clearPasswordFields();
    } catch (error: any) {
      // Section-level messages are set in updateField; keep this catch
      // to prevent an uncaught promise rejection from bubbling to console.
      pushToast(error?.message || 'Unable to save all changes.', 'error');
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

  $: if ($userEmail) {
    checkEmailChangeCompletion();
  }
</script>

<div class="mx-auto max-w-5xl px-6 md:px-10 select-none pb-20 pt-25 md:pt-30">
  <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <h1 class="lg:text-4xl md:text-3xl text-2xl font-bold text-left">Account Settings</h1>
      <p class="mt-3 text-sm md:text-base text-stone-400">
        Modify your avatar, username, and personal information.
      </p>
    </div>
    {#if !isEditing}
      <button class="btn btn-primary btn-sm md:btn-md" on:click={startEditing}>
        <i class="fa-solid fa-pen-to-square"></i>
        Edit Information
      </button>
    {/if}
  </div>

  <div class="rounded-3xl drop-shadow-xl/80 border-1 border-neutral bg-gradient-to-tr from-black to-zinc-800 p-4 md:p-8">
    <div class="mb-8 flex items-center gap-4 md:gap-6">
      <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-neutral/80 bg-zinc-800 flex items-center justify-center overflow-hidden drop-shadow-2xl">
        <img src={avatarUrl} alt="Avatar" class="w-full h-full object-cover" />
      </div>
      <div>
        <h2 class="text-xl md:text-2xl font-semibold text-left">{$username}</h2>
        <p class="text-sm text-stone-400">{$userEmail}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="rounded-2xl drop-shadow-xl/80 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700 p-5">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Username</h3>
          <i class="fa-regular fa-user text-primary"></i>
        </div>
        {#if isEditing}
          <input
            bind:value={editValues.username}
            class="input input-sm md:input-md input-bordered bg-base-100/80 border-neutral/80 focus:border-primary w-full mt-3"
            maxlength="30"
            placeholder="Enter username"
          />
        {:else}
          <p class="mt-3 text-stone-400 text-left">{$username}</p>
        {/if}
        {#if messages.username.text}
          <p class={`text-[11px] mt-2 text-left ${messages.username.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.username.text}</p>
        {/if}
      </div>

      <div class="rounded-2xl drop-shadow-xl/80 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700 p-5">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Email Address</h3>
          <i class="fa-regular fa-envelope text-primary"></i>
        </div>
        {#if isEditing}
          <input
            bind:value={editValues.email}
            type="email"
            class="input input-sm md:input-md input-bordered bg-base-100/80 border-neutral/80 focus:border-primary w-full mt-3"
            placeholder="Enter email address"
          />
        {:else}
          <p class="mt-3 text-stone-400 break-all text-left">{$userEmail}</p>
        {/if}
        {#if pendingEmail && pendingEmail.toLowerCase() !== $userEmail.toLowerCase()}
          <p class="mt-2 text-[11px] text-warning text-left">Pending confirmation for: {pendingEmail}</p>
        {/if}
        {#if messages.email.text}
          <p class={`text-[11px] mt-2 text-left ${messages.email.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.email.text}</p>
        {/if}
      </div>

      <div class="rounded-2xl drop-shadow-xl/80 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700 p-5">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Password</h3>
          <i class="fa-solid fa-key text-primary"></i>
        </div>
        {#if isEditing}
          <div class="space-y-2 mt-3">
            <div class="relative">
              <input
                bind:value={editValues.currentPassword}
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Current password"
                class="input input-sm input-bordered bg-base-100/80 border-neutral/80 focus:border-primary w-full pr-10"
              />
              <button
                type="button"
                class="btn btn-ghost btn-xs absolute right-1 top-1/2 -translate-y-1/2"
                on:click={() => (showCurrentPassword = !showCurrentPassword)}
                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              >
                <i class={`fa-solid ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div class="relative">
              <input
                bind:value={editValues.newPassword}
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New password"
                class="input input-sm input-bordered bg-base-100/80 border-neutral/80 focus:border-primary w-full pr-10"
              />
              <button
                type="button"
                class="btn btn-ghost btn-xs absolute right-1 top-1/2 -translate-y-1/2"
                on:click={() => (showNewPassword = !showNewPassword)}
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                <i class={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div class="relative">
              <input
                bind:value={editValues.confirmPassword}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                class="input input-sm input-bordered bg-base-100/80 border-neutral/80 focus:border-primary w-full pr-10"
              />
              <button
                type="button"
                class="btn btn-ghost btn-xs absolute right-1 top-1/2 -translate-y-1/2"
                on:click={() => (showConfirmPassword = !showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                <i class={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
        {:else}
          <p class="mt-3 tracking-widest text-stone-400 text-left">••••••••••••••••</p>
        {/if}
        {#if messages.password.text}
          <p class={`text-[11px] mt-2 text-left ${messages.password.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.password.text}</p>
        {/if}
      </div>

      <div class="rounded-2xl drop-shadow-xl/80 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700 p-5">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Profile Visibility</h3>
          <i class={`fa-solid ${isPublic ? 'fa-globe' : 'fa-lock'} text-primary`}></i>
        </div>
        {#if isEditing}
          <div class="mt-3 flex items-center gap-3">
            <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={editValues.visibility} />
            <span class="text-stone-400">{editValues.visibility ? 'Public' : 'Private'}</span>
          </div>
        {:else}
          <p class="mt-3 text-stone-400 text-left">{isPublic ? 'Public' : 'Private'}</p>
        {/if}
        {#if messages.visibility.text}
          <p class={`text-[11px] mt-2 text-left ${messages.visibility.type === 'success' ? 'text-success' : 'text-error'}`}>{messages.visibility.text}</p>
        {/if}
      </div>

      <div class="rounded-2xl drop-shadow-xl/80 border-1 border-neutral bg-gradient-to-tl from-base-100 to-zinc-700 p-5 md:col-span-2">
        <div class="flex items-center justify-center gap-3">
          <h3 class="text-base font-semibold">Member Since</h3>
          <i class="fa-solid fa-calendar-days text-primary"></i>
        </div>
        <p class="mt-3 text-stone-400 text-center">{createdAt || 'Loading...'}</p>
      </div>
    </div>

    {#if isEditing}
      <div class="mt-6 flex items-center justify-end gap-3">
        <button class="btn btn-ghost btn-sm md:btn-md" on:click={cancelEditing} disabled={isLoading}>
          Cancel
        </button>
        <button class="btn btn-primary btn-sm md:btn-md min-w-34" on:click={saveAllChanges} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- <div class="toast toast-bottom toast-end z-50">
  {#each toasts as toast (toast.id)}
    <div class={`alert shadow-lg ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
      <span>{toast.text}</span>
    </div>
  {/each}
</div> -->

<style>
  /* Subtle glass effects and transitions */
  .drop-shadow-2xl {
    filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.45));
  }
</style>
