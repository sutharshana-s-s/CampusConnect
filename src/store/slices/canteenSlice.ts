import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type CanteenItem = Database['public']['Tables']['canteen_items']['Row'];
type CanteenOrder = Database['public']['Tables']['canteen_orders']['Row'];

interface CanteenState {
  items: CanteenItem[];
  orders: CanteenOrder[];
  cart: Array<{ item: CanteenItem; quantity: number }>;
  loading: boolean;
  error: string | null;
}

const initialState: CanteenState = {
  items: [],
  orders: [],
  cart: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk('canteen/fetchItems', async () => {
  const { data, error } = await supabase
    .from('canteen_items')
    .select('*')
    .eq('is_available', true)
    .order('category', { ascending: true });
  
  if (error) throw error;
  return data;
});

export const placeOrder = createAsyncThunk(
  'canteen/placeOrder',
  async (order: Database['public']['Tables']['canteen_orders']['Insert']) => {
    const { data, error } = await supabase
      .from('canteen_orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

const canteenSlice = createSlice({
  name: 'canteen',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: CanteenItem; quantity: number }>) => {
      const existingItem = state.cart.find(cartItem => cartItem.item.id === action.payload.item.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.item.id !== action.payload);
    },
    updateCartQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const item = state.cart.find(cartItem => cartItem.item.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
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
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<CanteenItem[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<CanteenOrder>) => {
        state.orders.unshift(action.payload);
        state.cart = [];
      });
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, clearError } = canteenSlice.actions;
export default canteenSlice.reducer;