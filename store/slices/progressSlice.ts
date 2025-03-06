import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProgressPhoto {
  id: string
  date: string
  imageUrl: string
}

interface ProgressState {
  history: ProgressEntry[]
  photos: ProgressPhoto[]
}

const initialState: ProgressState = {
  history: [],
  photos: [],
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addProgressEntry: (state, action: PayloadAction<ProgressEntry>) => {
      state.history.push(action.payload)
    },
    addProgressPhoto: (state, action: PayloadAction<ProgressPhoto>) => {
      state.photos.push(action.payload)
    },
  },
})

export const { addProgressEntry, addProgressPhoto } = progressSlice.actions
export default progressSlice.reducer

