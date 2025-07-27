import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'];

interface MarketplaceState {
  items: MarketplaceItem[];
  myItems: MarketplaceItem[];
  wishlist: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketplaceState = {
  items: [],
  myItems: [],
  wishlist: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk('marketplace/fetchItems', async () => {
  const { data, error } = await supabase
    .from('marketplace_items')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
});

export const createItem = createAsyncThunk(
  'marketplace/createItem',
  async (item: Database['public']['Tables']['marketplace_items']['Insert']) => {
    const { data, error } = await supabase
      .from('marketplace_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(id => id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<MarketplaceItem[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(createItem.fulfilled, (state, action: PayloadAction<MarketplaceItem>) => {
        state.myItems.unshift(action.payload);
        state.items.unshift(action.payload);
      });
  },
});

export const { addToWishlist, removeFromWishlist, clearError } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;