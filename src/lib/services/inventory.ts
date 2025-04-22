import { supabase } from '$lib/supabase';

export interface InventoryItem {
  id?: number;
  name: string;
  user_id: string;
  created_at?: string;
}

export async function getInventoryItems(userId: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching inventory items:', error);
    return [];
  }
  
  return data || [];
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at'>): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory')
    .insert([item])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding inventory item:', error);
    return null;
  }
  
  return data;
}

export async function removeInventoryItem(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error removing inventory item:', error);
    return false;
  }
  
  return true;
}