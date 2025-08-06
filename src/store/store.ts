import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import clubSlice from './slices/clubSlice';
import hostelSlice from './slices/hostelSlice';
import canteenSlice from './slices/canteenSlice';
import marketplaceSlice from './slices/marketplaceSlice';
import messagesSlice from './slices/messagesSlice';
import settingsSlice from './slices/settingsSlice';
import activitySlice from './slices/activitySlice';
import eventsSlice from './slices/eventsSlice';
import dashboardSlice from './slices/dashboardSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};

const settingsPersistConfig = {
  key: 'settings',
  storage,
  whitelist: ['theme', 'displayName', 'email'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedSettingsReducer = persistReducer(settingsPersistConfig, settingsSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    clubs: clubSlice,
    hostel: hostelSlice,
    canteen: canteenSlice,
    marketplace: marketplaceSlice,
    messages: messagesSlice,
    settings: persistedSettingsReducer,
    activity: activitySlice,
    events: eventsSlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;