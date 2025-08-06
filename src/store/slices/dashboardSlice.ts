import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { errorService } from '../../services/errorService';

export interface DashboardStats {
  totalStudents: number;
  activeClubs: number;
  canteenOrders: number;
  marketplaceItems: number;
  studentChange: string;
  clubChange: string;
  orderChange: string;
  marketplaceChange: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async () => {
    try {
      const now = new Date();
      const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const previousMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
      const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

      // Get current user info
      const { data: { user } } = await supabase.auth.getUser();
      const userRole = user?.user_metadata?.role || 'student';
      

      
      // Fetch total students (profiles with student role)
      const { count: studentCount, error: studentError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (studentError) throw studentError;

      // Fetch active clubs count
      const { count: clubCount, error: clubError } = await supabase
        .from('clubs')
        .select('*', { count: 'exact', head: true });

      if (clubError) throw clubError;

      // Fetch canteen orders count based on user role
      let orderCount = 0;
      
      if (userRole === 'canteen_vendor' || userRole === 'super_admin') {
        // These roles can see all orders
        const { data: orders, error: orderError } = await supabase
          .from('canteen_orders')
          .select('*');

        if (orderError) {
          errorService.handleDatabaseError(orderError, 'Dashboard Stats');
          orderCount = 0;
        } else {
          orderCount = orders?.length || 0;
        }
      } else {
        // For other roles, try to get a count using a different approach
        // This might not work due to RLS, but we'll try
        const { count: altOrderCount, error: altError } = await supabase
          .from('canteen_orders')
          .select('*', { count: 'exact', head: true });
        
        if (altError) {
          errorService.handleDatabaseError(altError, 'Dashboard Stats');
          // For non-admin users, we might not be able to count all orders
          // This is expected behavior due to RLS
          orderCount = 0;
        } else {
          orderCount = altOrderCount || 0;
        }
      }

             // Fetch marketplace items count
       const { count: marketplaceCount, error: marketplaceError } = await supabase
         .from('marketplace_items')
         .select('*', { count: 'exact', head: true })
         .eq('is_available', true);

       if (marketplaceError) throw marketplaceError;

       

                // Calculate real percentage changes based on actual data
        const calculatePercentageChange = (current: number, previous: number): string => {
          if (previous === 0 && current === 0) {
            // If there was no data last month and no data this month, show 0%
            return '+0.0%';
          }
          if (previous === 0) {
            // If there was no data last month, show as new growth
            return current > 0 ? '+100.0%' : '+0.0%';
          }
          if (current === 0) {
            // If there's no data this month but there was last month, show as decrease
            return '-100.0%';
          }
          const change = ((current - previous) / previous) * 100;
          return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        };

        // Get current month and previous month data for percentage calculations
        const { data: studentData } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('role', 'student');
        
        const currentMonthStudents = studentData?.filter(s => {
          const createdDate = new Date(s.created_at);
          return createdDate >= currentMonthStart && createdDate < nextMonthStart;
        }).length || 0;
        
        const previousMonthStudents = studentData?.filter(s => {
          const createdDate = new Date(s.created_at);
          return createdDate >= previousMonthStart && createdDate < currentMonthStart;
        }).length || 0;
        
        // Calculate club changes
        const { data: clubData } = await supabase
          .from('clubs')
          .select('created_at');
        
        const currentMonthClubs = clubData?.filter(c => {
          const createdDate = new Date(c.created_at);
          return createdDate >= currentMonthStart && createdDate < nextMonthStart;
        }).length || 0;
        
        const previousMonthClubs = clubData?.filter(c => {
          const createdDate = new Date(c.created_at);
          return createdDate >= previousMonthStart && createdDate < currentMonthStart;
        }).length || 0;
        
        // Calculate order changes
        const { data: orderData } = await supabase
          .from('canteen_orders')
          .select('created_at');
        
        const currentMonthOrders = orderData?.filter(o => {
          const createdDate = new Date(o.created_at);
          return createdDate >= currentMonthStart && createdDate < nextMonthStart;
        }).length || 0;
        
        const previousMonthOrders = orderData?.filter(o => {
          const createdDate = new Date(o.created_at);
          return createdDate >= previousMonthStart && createdDate < currentMonthStart;
        }).length || 0;
        
        // Calculate marketplace changes
        const { data: marketplaceData } = await supabase
          .from('marketplace_items')
          .select('created_at')
          .eq('is_available', true);
        
        const currentMonthMarketplace = marketplaceData?.filter(m => {
          const createdDate = new Date(m.created_at);
          return createdDate >= currentMonthStart && createdDate < nextMonthStart;
        }).length || 0;
        
        const previousMonthMarketplace = marketplaceData?.filter(m => {
          const createdDate = new Date(m.created_at);
          return createdDate >= previousMonthStart && createdDate < currentMonthStart;
        }).length || 0;

        const result = {
          totalStudents: studentCount || 0,
          activeClubs: clubCount || 0,
          canteenOrders: orderCount || 0,
          marketplaceItems: marketplaceCount || 0,
          studentChange: calculatePercentageChange(currentMonthStudents, previousMonthStudents),
          clubChange: calculatePercentageChange(currentMonthClubs, previousMonthClubs),
          orderChange: calculatePercentageChange(currentMonthOrders, previousMonthOrders),
          marketplaceChange: calculatePercentageChange(currentMonthMarketplace, previousMonthMarketplace),
        };
      
      return result;
    } catch (error) {
      errorService.handleUnexpectedError(error, 'Dashboard Stats');
      throw error;
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearStats: (state) => {
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      });
  },
});

export const { clearStats } = dashboardSlice.actions;
export default dashboardSlice.reducer; 