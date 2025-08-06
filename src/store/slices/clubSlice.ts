import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Club = Database['public']['Tables']['clubs']['Row'];
type ClubMember = Database['public']['Tables']['club_members']['Row'] & {
  position: 'member' | 'secretary' | 'treasurer' | 'event_manager';
};
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ClubMemberWithProfile extends ClubMember {
  profile: Profile;
}

interface ClubState {
  clubs: Club[];
  myClubs: Club[];
  clubMembers: ClubMemberWithProfile[];
  membershipRequests: ClubMemberWithProfile[];
  userClubMemberships: ClubMember[];
  loading: boolean;
  error: string | null;
  currentUserClubRole: 'club_head' | 'member' | 'secretary' | 'treasurer' | 'event_manager' | undefined;
}

const initialState: ClubState = {
  clubs: [],
  myClubs: [],
  clubMembers: [],
  membershipRequests: [],
  userClubMemberships: [],
  loading: false,
  error: null,
  currentUserClubRole: undefined,
};

export const fetchUserClubMemberships = createAsyncThunk(
  'clubs/fetchUserClubMemberships',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('club_members')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
);

// ✅ Get current user's role in a given club
export const fetchMyRoleInClub = createAsyncThunk(
  'clubs/fetchMyRoleInClub',
  async ({ clubId, userId }: { clubId: string; userId: string }) => {
    const clubRes = await supabase.from('clubs').select('*').eq('id', clubId).single();
    if (clubRes.error) throw clubRes.error;

    if (clubRes.data.club_head_id === userId) {
      return 'club_head';
    }

    const memberRes = await supabase
      .from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', userId)
      .eq('status', 'approved')
      .single();

    if (memberRes.error || !memberRes.data) return undefined;
    return memberRes.data.position as ClubState['currentUserClubRole'];
  }
);

// ✅ Fetch all active clubs
export const fetchClubs = createAsyncThunk('clubs/fetchClubs', async () => {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data;
});

// ✅ Fetch approved members of a club
export const fetchClubMembers = createAsyncThunk(
  'clubs/fetchClubMembers',
  async (clubId: string) => {
    const { data, error } = await supabase
      .from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .eq('status', 'approved');

    if (error) throw error;

    // Fetch profiles separately and merge
    const userIds = data.map(member => member.user_id);
    let profiles: any = {};
    
    if (userIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('id', userIds);

      if (!profileError && profileData) {
        profileData.forEach((profile: any) => {
          profiles[profile.id] = profile;
        });
      }
    }

    return data.map((row) => ({
      ...row,
      profile: profiles[row.user_id] || null,
    })) as ClubMemberWithProfile[];
  }
);

// ✅ Fetch pending membership requests
export const fetchMembershipRequests = createAsyncThunk(
  'clubs/fetchMembershipRequests',
  async (clubId: string) => {
    const { data, error } = await supabase
      .from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .eq('status', 'pending');

    if (error) throw error;

    // Fetch profiles separately and merge
    const userIds = data.map(member => member.user_id);
    let profiles: any = {};
    
    if (userIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('id', userIds);

      if (!profileError && profileData) {
        profileData.forEach((profile: any) => {
          profiles[profile.id] = profile;
        });
      }
    }

    return data.map((row) => ({
      ...row,
      profile: profiles[row.user_id] || null,
    })) as ClubMemberWithProfile[];
  }
);

// ✅ Update member status (approve/reject) + assign role
export const updateMembershipStatus = createAsyncThunk(
  'clubs/updateMembershipStatus',
  async ({
    requestId,
    status,
    position,
  }: {
    requestId: string;
    status: 'approved' | 'rejected';
    position?: 'member' | 'secretary' | 'treasurer' | 'event_manager';
  }) => {
    const updateData: any = { status };
    if (position) updateData.position = position;

    const { data, error } = await supabase
      .from('club_members')
      .update(updateData)
      .eq('id', requestId)
      .select('*')
      .single();

    if (error) throw error;

    // Fetch the user profile separately
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', data.user_id)
      .single();

    return {
      ...data,
      profile: profileError ? null : profile,
    } as ClubMemberWithProfile;
  }
);

// ✅ Join a club (creates pending request)
export const joinClub = createAsyncThunk(
  'clubs/joinClub',
  async ({ clubId, userId }: { clubId: string; userId: string }) => {
    const { data, error } = await supabase
      .from('club_members')
      .insert({
        club_id: clubId,
        user_id: userId,
        status: 'pending',
        position: 'member',
      })
      .select('*')
      .single();

    if (error) throw error;

    // Fetch the user profile separately
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', userId)
      .single();

    return {
      ...data,
      profile: profileError ? null : profile,
    } as ClubMemberWithProfile;
  }
);

// ✅ Leave a club
export const leaveClub = createAsyncThunk(
  'clubs/leaveClub',
  async ({ clubId, userId }: { clubId: string; userId: string }) => {
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', clubId)
      .eq('user_id', userId);

    if (error) throw error;
    return { clubId, userId };
  }
);

export const updateClubDetails = createAsyncThunk(
  'clubs/updateClubDetails',
  async ({ 
    clubId, 
    name, 
    description, 
    category 
  }: { 
    clubId: string; 
    name: string; 
    description: string; 
    category: string; 
  }) => {
    const { data, error } = await supabase
      .from('clubs')
      .update({
        name,
        description,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', clubId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action: PayloadAction<Club[]>) => {
        state.loading = false;
        state.clubs = action.payload;
        state.error = null;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clubs';
      })

      .addCase(fetchClubMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubMembers.fulfilled, (state, action: PayloadAction<ClubMemberWithProfile[]>) => {
        state.loading = false;
        state.clubMembers = action.payload;
        state.error = null;
      })
      .addCase(fetchClubMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch club members';
      })

      .addCase(fetchMembershipRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipRequests.fulfilled, (state, action: PayloadAction<ClubMemberWithProfile[]>) => {
        state.loading = false;
        state.membershipRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchMembershipRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch membership requests';
      })

      .addCase(updateMembershipStatus.fulfilled, (state, action: PayloadAction<ClubMemberWithProfile>) => {
        const { status } = action.payload;
        if (status === 'approved') {
          state.membershipRequests = state.membershipRequests.filter(req => req.id !== action.payload.id);
          state.clubMembers.push(action.payload);
        } else {
          state.membershipRequests = state.membershipRequests.filter(req => req.id !== action.payload.id);
        }
      })

      .addCase(joinClub.fulfilled, (state, action: PayloadAction<ClubMemberWithProfile>) => {
        state.membershipRequests.push(action.payload);
      })

      .addCase(leaveClub.fulfilled, (state, action) => {
        state.clubMembers = state.clubMembers.filter(
          member => !(member.club_id === action.payload.clubId && member.user_id === action.payload.userId)
        );
      })

      .addCase(fetchMyRoleInClub.fulfilled, (state, action: PayloadAction<ClubState['currentUserClubRole']>) => {
        state.currentUserClubRole = action.payload;
      })

      .addCase(fetchUserClubMemberships.fulfilled, (state, action: PayloadAction<ClubMember[]>) => {
        state.userClubMemberships = action.payload;
      })

      .addCase(updateClubDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClubDetails.fulfilled, (state, action: PayloadAction<Club>) => {
        state.loading = false;
        // Update the club in the clubs array
        const index = state.clubs.findIndex(club => club.id === action.payload.id);
        if (index !== -1) {
          state.clubs[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateClubDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update club details';
      })

  },
});

export const { clearError } = clubSlice.actions;
export default clubSlice.reducer;
