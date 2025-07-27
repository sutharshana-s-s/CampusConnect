import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  displayName: string;
  email: string;
}

const initialState: SettingsState = {
  theme: 'system',
  emailNotifications: true,
  pushNotifications: true,
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
    setEmailNotifications: (state, action: PayloadAction<boolean>) => {
      state.emailNotifications = action.payload;
    },
    setPushNotifications: (state, action: PayloadAction<boolean>) => {
      state.pushNotifications = action.payload;
    },
    updateProfile: (state, action: PayloadAction<{ displayName: string; email: string }>) => {
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
    },
  },
});

export const {
  setTheme,
  setEmailNotifications,
  setPushNotifications,
  updateProfile,
} = settingsSlice.actions;

export default settingsSlice.reducer;
