import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PointsState {
  total: number
  history: { date: string; points: number; reason: string }[]
}

const initialState: PointsState = {
  total: 0,
  history: [],
}

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    addPoints: (state, action: PayloadAction<{ points: number; reason: string }>) => {
      state.total += action.payload.points
      state.history.push({
        date: new Date().toISOString(),
        points: action.payload.points,
        reason: action.payload.reason,
      })
    },
  },
})

export const { addPoints } = pointsSlice.actions
export default pointsSlice.reducer

