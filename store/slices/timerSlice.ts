import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TimerState {
  time: number
  isActive: boolean
  endTime: number | null
}

const initialState: TimerState = {
  time: 0,
  isActive: false,
  endTime: null,
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setTimerState: (state, action: PayloadAction<Partial<TimerState>>) => {
      return { ...state, ...action.payload }
    },
    resetTimer: () => initialState,
  },
})

export const { setTimerState, resetTimer } = timerSlice.actions
export default timerSlice.reducer

