<script lang="ts">
    import { onMount } from 'svelte';
    import Auth from '$lib/components/Auth.svelte';
    import { user, loading, initializeAuth, signOut } from '$lib/stores/auth';
    import { getInventoryItems, addInventoryItem, removeInventoryItem } from '$lib/services/inventory';
    import type { InventoryItem } from '$lib/services/inventory';
    
    let newItem = '';
    let inventory: InventoryItem[] = [];
    let loadingInventory = false;
    let message: { type: string; text: string } | null = null;
    
    onMount(() => {
        console.log('Component mounted, initializing auth...');
        initializeAuth();
        
        // Subscribe to user store to load inventory when user changes
        const unsubscribe = user.subscribe(async (userData) => {
            console.log('User state changed:', userData ? 'logged in' : 'logged out');
            if (userData) {
                console.log('Loading inventory for user:', userData.id);
                await loadInventory(userData.id);
            } else {
                console.log('No user, clearing inventory');
                inventory = [];
            }
        });
        
        return unsubscribe;
    });
    
    async function loadInventory(userId: string) {
        loadingInventory = true;
        console.log('Fetching inventory items from Supabase...');
        inventory = await getInventoryItems(userId);
        console.log('Inventory items loaded:', inventory.length);
        loadingInventory = false;
    }
    
    async function handleAddItem() {
        if (!newItem.trim() || !$user) return;
        
        const itemToAdd = {
            name: newItem.trim(),
            user_id: $user.id
        };
        
        console.log('Adding new item to inventory:', itemToAdd);
        const addedItem = await addInventoryItem(itemToAdd);
        
        if (addedItem) {
            console.log('Item added successfully:', addedItem);
            inventory = [addedItem, ...inventory];
            newItem = '';
        } else {
            console.error('Failed to add item');
        }
    }
    
    async function handleRemoveItem(id: number) {
        console.log('Removing item with id:', id);
        const success = await removeInventoryItem(id);
        
        if (success) {
            console.log('Item removed successfully');
            inventory = inventory.filter(item => item.id !== id);
        } else {
            console.error('Failed to remove item');
        }
    }
    
    function handleSignOut() {
        console.log('User signing out');
        signOut();
    }
    
    function handleAuthMessage(event: CustomEvent) {
        console.log('Auth message received:', event.detail);
        message = event.detail;
        // Clear message after 5 seconds
        setTimeout(() => {
            message = null;
        }, 5000);
    }
    
    function handleSignedIn() {
        console.log('Sign in successful!');
        // You could show a welcome message or perform other actions
        message = {
            type: 'success',
            text: 'Signed in successfully! Welcome to Reselling Suite.'
        };
    }
</script>

<main>
    <h1>Reselling Suite</h1>
    
    {#if message}
        <div class="message {message.type}">
            {message.text}
        </div>
    {/if}
    
    {#if $loading}
        <p class="loading">Loading authentication state...</p>
    {:else if !$user}
        <Auth on:signedIn={handleSignedIn} on:message={handleAuthMessage} />
    {:else}
        <div class="user-bar">
            <p>Signed in as {$user.email}</p>
            <button class="sign-out" on:click={handleSignOut}>Sign Out</button>
        </div>
        
        <div class="inventory-form">
            <h2>Add New Inventory Item</h2>
            <form on:submit|preventDefault={handleAddItem}>
                <input 
                    type="text" 
                    bind:value={newItem} 
                    placeholder="Enter item name"
                    autocomplete="off"
                />
                <button type="submit">Add Item</button>
            </form>
        </div>
        
        <div class="inventory-list">
            <h2>Current Inventory ({inventory.length} items)</h2>
            {#if loadingInventory}
                <p class="loading">Loading inventory...</p>
            {:else if inventory.length === 0}
                <p class="empty-message">No items in inventory yet.</p>
            {:else}
                <ul>
                    {#each inventory as item (item.id)}
                        <li>
                            <span>{item.name}</span>
                            <button class="remove-btn" on:click={() => handleRemoveItem(item.id)}>Remove</button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    {/if}
</main>

<style>
    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        font-family: system-ui, -apple-system, sans-serif;
    }
    
    h1 {
        color: #333;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    h2 {
        color: #444;
        margin-bottom: 1rem;
    }
    
    .inventory-form {
        margin-bottom: 2rem;
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    form {
        display: flex;
        gap: 0.5rem;
    }
    
    input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    button {
        background: #3355ff;
        color: white;
        border: none;
        padding: 0.75rem 1.25rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
    }
    
    button:hover {
        background: #2244ee;
    }
    
    .inventory-list {
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;
    }
    
    li:last-child {
        border-bottom: none;
    }
    
    .empty-message {
        color: #666;
        font-style: italic;
    }
    
    .remove-btn {
        background: #ff3355;
        font-size: 0.85rem;
        padding: 0.5rem 0.75rem;
    }
    
    .remove-btn:hover {
        background: #ee2244;
    }
    
    .loading {
        text-align: center;
        color: #666;
        font-style: italic;
    }
    
    .user-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 0.75rem 1rem;
        background: #f0f0f0;
        border-radius: 8px;
    }
    
    .user-bar p {
        margin: 0;
        font-weight: 500;
    }
    
    .sign-out {
        background: #999;
        font-size: 0.85rem;
        padding: 0.5rem 0.75rem;
    }
    
    .sign-out:hover {
        background: #777;
    }
    
    .message {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .message.success {
        background: #e7f7e7;
        color: #0a6b0a;
    }
    
    .message.error {
        background: #ffeeee;
        color: #cc0000;
    }
</style>
