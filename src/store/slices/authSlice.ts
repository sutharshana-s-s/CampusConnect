import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No session found');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    return profile;
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    return profile;
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, fullName, role, studentId }: {
    email: string;
    password: string;
    fullName: string;
    role: Profile['role'];
    studentId?: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          student_id: studentId,
        })
        .select()
        .single();
      
      if (profileError) throw profileError;
      return profile;
    }
    
    throw new Error('User creation failed');
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
  
  return profile;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        // Don't clear user state on session check failure
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign in failed';
      })
      .addCase(signUp.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign up failed';
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign out failed';
      })
      .addCase(getCurrentUser.pending, (state) => {
        // Don't change loading state here
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<Profile | null>) => {
        state.loading = false;
        // Only update user if we got a valid profile
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        // Don't clear user state on rejection
      });
  },
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;