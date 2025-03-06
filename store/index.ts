import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import progressReducer from './slices/progressSlice'
import nutritionReducer from './slices/nutritionSlice'
import workoutReducer from './slices/workoutSlice'
import challengeReducer from './slices/challengeSlice'
import socialReducer from './slices/socialSlice'
import pointsReducer from './slices/pointsSlice'
import streakReducer from './slices/streakSlice'
import timerReducer from './slices/timerSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    progress: progressReducer,
    nutrition: nutritionReducer,
    workout: workoutReducer,
    challenge: challengeReducer,
    social: socialReducer,
    points: pointsReducer,
    streak: streakReducer,
    timer: timerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

