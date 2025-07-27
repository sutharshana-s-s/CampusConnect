import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type HostelComplaint = Database['public']['Tables']['hostel_complaints']['Row'];
type HostelRoom = Database['public']['Tables']['hostel_rooms']['Row'];

interface HostelState {
  complaints: HostelComplaint[];
  rooms: HostelRoom[];
  loading: boolean;
  error: string | null;
}

const initialState: HostelState = {
  complaints: [],
  rooms: [],
  loading: false,
  error: null,
};

export const fetchComplaints = createAsyncThunk(
  'hostel/fetchComplaints',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('hostel_complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
);

export const submitComplaint = createAsyncThunk(
  'hostel/submitComplaint',
  async (complaint: Database['public']['Tables']['hostel_complaints']['Insert']) => {
    const { data, error } = await supabase
      .from('hostel_complaints')
      .insert(complaint)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

const hostelSlice = createSlice({
  name: 'hostel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action: PayloadAction<HostelComplaint[]>) => {
        state.loading = false;
        state.complaints = action.payload;
        state.error = null;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch complaints';
      })
      .addCase(submitComplaint.fulfilled, (state, action: PayloadAction<HostelComplaint>) => {
        state.complaints.unshift(action.payload);
      });
  },
});

export const { clearError } = hostelSlice.actions;
export default hostelSlice.reducer;