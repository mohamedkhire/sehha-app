import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StreakState {
  currentStreak: number
  lastActivityDate: string | null
}

const initialState: StreakState = {
  currentStreak: 0,
  lastActivityDate: null,
}

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    updateStreak: (state) => {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastActivityDate === today) {
        return state;
      }
      if (state.lastActivityDate === yesterday()) {
        state.currentStreak += 1;
      } else {
        state.currentStreak = 1;
      }
      state.lastActivityDate = today;
    },
    resetStreak: (state) => {
      state.currentStreak = 0;
      state.lastActivityDate = null;
    },
  },
})

export const { updateStreak, resetStreak } = streakSlice.actions;
export default streakSlice.reducer;

function yesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

