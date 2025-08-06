import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

type EventItem = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  time?: string;
  location?: string;
  organizer?: string;
  type?: 'club_event' | 'general_event' | 'academic_event';
  status?: 'upcoming' | 'ongoing' | 'completed';
  club_id?: string;
  created_at: string;
};

interface EventsState {
  events: EventItem[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcomingEvents',
  async () => {
    const events: EventItem[] = [];

    try {
      // Try to fetch from events table first
      const { data: generalEvents, error: generalError } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0]) // Only future events
        .order('date', { ascending: true })
        .limit(10);

      if (generalError) {
        console.error('Error fetching general events:', generalError);
      } else if (generalEvents) {
        console.log('Fetched general events:', generalEvents.length);
        generalEvents.forEach(event => {
          events.push({
            id: `event_${event.id}`,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            organizer: event.organizer,
            type: 'general_event',
            status: 'upcoming',
            created_at: event.created_at,
          });
        });
      }

      // Try to fetch from club_events table
      const { data: clubEvents, error: clubError } = await supabase
        .from('club_events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0]) // Only future events
        .order('date', { ascending: true })
        .limit(10);

      if (clubError) {
        console.error('Error fetching club events:', clubError);
      } else if (clubEvents) {
        console.log('Fetched club events:', clubEvents.length);
        clubEvents.forEach(event => {
          events.push({
            id: `club_event_${event.id}`,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            organizer: event.club_name || 'Club Event',
            type: 'club_event',
            status: 'upcoming',
            club_id: event.club_id,
            created_at: event.created_at,
          });
        });
      }

      // Sort all events by date (earliest first)
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      console.log('Total events found:', events.length);

      // Return only the next 10 upcoming events (we'll show 3 initially on dashboard)
      return events.slice(0, 10);

    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action: PayloadAction<EventItem[]>) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      });
  },
});

export const { clearError } = eventsSlice.actions;
export default eventsSlice.reducer; 