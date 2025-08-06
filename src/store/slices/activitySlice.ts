import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type ActivityItem = {
  id: string;
  type: 'club_joined' | 'complaint_submitted' | 'order_placed' | 'item_sold' | 'message_received';
  title: string;
  description: string;
  timestamp: string; // ISO string for serialization
  status?: 'pending' | 'approved' | 'completed' | 'urgent';
  user_id?: string;
  related_id?: string;
};

interface ActivityState {
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchUserActivities = createAsyncThunk(
  'activity/fetchUserActivities',
  async (userId: string) => {
    const activities: ActivityItem[] = [];

    try {
      // 1. Fetch club memberships
      const { data: clubMemberships, error: clubError } = await supabase
        .from('club_members')
        .select('*')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false })
        .limit(5);

      if (!clubError && clubMemberships) {
        clubMemberships.forEach(membership => {
          activities.push({
            id: `club_${membership.id}`,
            type: 'club_joined',
            title: `Club Membership`,
            description: `You ${membership.status === 'approved' ? 'joined' : 'requested to join'} a club`,
            timestamp: new Date(membership.joined_at).toISOString(),
            status: membership.status as 'pending' | 'approved',
            user_id: membership.user_id,
            related_id: membership.club_id,
          });
        });
      }

      // 2. Fetch hostel complaints
      const { data: complaints, error: complaintError } = await supabase
        .from('hostel_complaints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!complaintError && complaints) {
        complaints.forEach(complaint => {
          activities.push({
            id: `complaint_${complaint.id}`,
            type: 'complaint_submitted',
            title: `Hostel Complaint: ${complaint.title}`,
            description: `Status: ${complaint.status}`,
            timestamp: new Date(complaint.created_at).toISOString(),
            status: complaint.status === 'resolved' ? 'completed' : 
                   complaint.status === 'in_progress' ? 'pending' : 'pending',
            user_id: complaint.user_id,
            related_id: complaint.id,
          });
        });
      }

      // 3. Fetch canteen orders
      const { data: orders, error: orderError } = await supabase
        .from('canteen_orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!orderError && orders) {
        orders.forEach(order => {
          activities.push({
            id: `order_${order.id}`,
            type: 'order_placed',
            title: `Canteen Order #${order.id.slice(0, 8)}`,
            description: `Total: ₹${order.total_amount} - Status: ${order.status}`,
            timestamp: new Date(order.created_at).toISOString(),
            status: order.status === 'delivered' ? 'completed' : 
                   order.status === 'pending' ? 'pending' : 'pending',
            user_id: order.user_id,
            related_id: order.id,
          });
        });
      }

      // 4. Fetch marketplace items (if user has any)
      const { data: marketplaceItems, error: marketplaceError } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('seller_id', userId)
        .limit(5);

      if (!marketplaceError && marketplaceItems) {
        marketplaceItems.forEach(item => {
          activities.push({
            id: `marketplace_${item.id}`,
            type: 'item_sold',
            title: `Marketplace Item: ${item.title}`,
            description: `Price: ₹${item.price} - Status: ${item.is_available ? 'available' : 'sold'}`,
            timestamp: new Date(item.created_at || Date.now()).toISOString(),
            status: item.is_available ? 'pending' : 'completed',
            user_id: item.seller_id,
            related_id: item.id,
          });
        });
      }

      // Sort all activities by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Return only the most recent 10 activities
      return activities.slice(0, 10);

    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivities.fulfilled, (state, action: PayloadAction<ActivityItem[]>) => {
        state.loading = false;
        state.activities = action.payload;
        state.error = null;
      })
      .addCase(fetchUserActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      });
  },
});

export const { clearError } = activitySlice.actions;
export default activitySlice.reducer; 