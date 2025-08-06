import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  displayName: string;
  email: string;
}

const initialState: SettingsState = {
  theme: 'system',
  displayName: '',
  email: ''
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    updateProfile: (state, action: PayloadAction<{ displayName: string; email: string }>) => {
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
    },
  },
});

export const {
  setTheme,
  updateProfile,
} = settingsSlice.actions;

export default settingsSlice.reducer;
