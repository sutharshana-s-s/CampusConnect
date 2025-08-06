import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type HostelComplaint = Database['public']['Tables']['hostel_complaints']['Row'];
type HostelComplaintWithUser = HostelComplaint & {
  user_name?: string;
  room_number?: string;
};
type HostelRoom = Database['public']['Tables']['hostel_rooms']['Row'];

interface HostelState {
  complaints: HostelComplaintWithUser[];
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

export const fetchAllComplaints = createAsyncThunk(
  'hostel/fetchAllComplaints',
  async () => {
    const { data, error } = await supabase
      .from('hostel_complaints')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Fetch profiles separately
    const userIds = data.map(complaint => complaint.user_id);
    let profiles: any = {};
    
    if (userIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, hostel_block, room_number')
        .in('id', userIds);
      
      if (!profileError && profileData) {
        profileData.forEach((profile: any) => {
          profiles[profile.id] = profile;
        });
      }
    }
    
    // Transform the data to include user_name
    return data.map(complaint => ({
      ...complaint,
      user_name: profiles[complaint.user_id]?.full_name || 'Unknown',
      room_number: profiles[complaint.user_id]?.room_number || 'N/A'
    }));
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'hostel/updateComplaintStatus',
  async ({ complaintId, status }: { complaintId: string; status: string }) => {
    const { data, error } = await supabase
      .from('hostel_complaints')
      .update({ status })
      .eq('id', complaintId)
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
      })
      .addCase(fetchAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action: PayloadAction<HostelComplaintWithUser[]>) => {
        state.loading = false;
        state.complaints = action.payload;
        state.error = null;
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch all complaints';
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action: PayloadAction<HostelComplaint>) => {
        const index = state.complaints.findIndex(complaint => complaint.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      });
  },
});

export const { clearError } = hostelSlice.actions;
export default hostelSlice.reducer;