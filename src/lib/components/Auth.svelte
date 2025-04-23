<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { supabase } from '$lib/supabase';
    
    const dispatch = createEventDispatcher();
    
    let email = '';
    let password = '';
    let loading = false;
    let error: string | null = null;
    let isSignUp = false;
    
    async function handleAuth() {
        console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
        loading = true;
        error = null;
        
        try {
            if (isSignUp) {
                console.log('Registering new user...');
                const { data, error: signUpError } = await supabase.auth.signUp({ 
                    email, 
                    password 
                });
                
                console.log('Sign up response:', data ? 'Success' : 'Failed');
                
                if (signUpError) {
                    console.error('Sign up error:', signUpError);
                    throw signUpError;
                }
                
                // Show success message for sign up
                console.log('Dispatching sign up success message');
                dispatch('message', {
                    type: 'success',
                    text: 'Check your email for the confirmation link!'
                });
                
            } else {
                console.log('Signing in existing user...');
                const { data, error: signInError } = await supabase.auth.signInWithPassword({ 
                    email, 
                    password 
                });
                
                console.log('Sign in response:', data?.user ? 'Success' : 'Failed');
                
                if (signInError) {
                    console.error('Sign in error:', signInError);
                    throw signInError;
                }
                
                // Successfully logged in
                console.log('Successfully signed in, dispatching event');
                dispatch('signedIn');
            }
            
        } catch (e) {
            console.error('Auth error:', e);
            error = e.message || 'An error occurred during authentication.';
        } finally {
            loading = false;
        }
    }
    
    function toggleMode() {
        console.log(`Switching to ${!isSignUp ? 'sign up' : 'sign in'} mode`);
        isSignUp = !isSignUp;
        error = null;
    }
</script>

<div class="auth-container">
    <h2>{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
    
    <form on:submit|preventDefault={handleAuth}>
        {#if error}
            <div class="error">{error}</div>
        {/if}
        
        <div class="form-group">
            <label for="email">Email</label>
            <input 
                id="email"
                type="email" 
                bind:value={email} 
                placeholder="Your email"
                required
            />
        </div>
        
        <div class="form-group">
            <label for="password">Password</label>
            <input 
                id="password"
                type="password" 
                bind:value={password} 
                placeholder="Your password"
                required
                minlength="6"
            />
        </div>
        
        <button type="submit" class="auth-button" disabled={loading}>
            {#if loading}
                Loading...
            {:else}
                {isSignUp ? 'Sign Up' : 'Sign In'}
            {/if}
        </button>
    </form>
    
    <p class="toggle-text">
        {isSignUp ? 'Already have an account?' : 'Need an account?'}
        <button type="button" class="link-button" on:click={toggleMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
    </p>
</div>

<style>
    .auth-container {
        background: #f9f9f9;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        max-width: 400px;
        margin: 0 auto;
    }
    
    h2 {
        margin-top: 0;
        color: #333;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
    }
    
    .auth-button {
        width: 100%;
        background: #3355ff;
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
    }
    
    .auth-button:hover {
        background: #2244ee;
    }
    
    .auth-button:disabled {
        background: #cccccc;
        cursor: not-allowed;
    }
    
    .toggle-text {
        text-align: center;
        margin-top: 1.5rem;
        color: #555;
    }
    
    .link-button {
        background: none;
        border: none;
        color: #3355ff;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        font-size: inherit;
        text-decoration: underline;
    }
    
    .link-button:hover {
        color: #2244ee;
    }
    
    .error {
        background: #ffeeee;
        color: #cc0000;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
</style>