<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../../supabase';
    import { push } from 'svelte-spa-router';
    import { isLoggedIn } from '../../stores/login';

    let message = 'Setting up your account...';
    let isSuccess = false;

    onMount(async () => {
        try {
            console.log('Callback page mounted');

            // Get the hash parameters
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            console.log('Got access token:', !!accessToken);

            if (accessToken) {
                // Set the session with the access token
                const { data: { session }, error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: hashParams.get('refresh_token') ?? ''
                });

                if (sessionError) {
                    throw sessionError;
                }

                if (session?.user) {
                    const user = session.user;
                    console.log('Authenticated user:', {
                        id: user.id,
                        email: user.email,
                        metadata: user.user_metadata
                    });

                    // Create profile
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: user.id,
                                username: user.user_metadata.username,
                                email: user.email,
                                updated_at: new Date()
                            }
                        ]);

                    if (profileError) {
                        console.error('Profile error:', profileError);
                        message = 'Error creating profile';
                        return;
                    }

                    // Set login state and redirect
                    isLoggedIn.set(true);
                    isSuccess = true;
                    message = 'Account setup complete!';

                    /* setTimeout(() => {
                        push('/');
                    }, 2000); */
                }
            } else {
                throw new Error('No access token found');
            }
        } catch (error) {
            console.error('Error:', error);
            message = 'Error setting up account';
            setTimeout(() => {
                push('/login');
            }, 2000);
        }
    });
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
        {#if !isSuccess}
            <div class="loading loading-spinner loading-lg"></div>
        {:else}
            <div class="text-success text-4xl">✓</div>
        {/if}
        <p class="mt-4">{message}</p>
    </div>
</div>