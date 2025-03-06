import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Exercise {
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: number;
    weight?: number;
  }[];
  date: string;
}

interface WorkoutState {
  plans: WorkoutPlan[];
}

const initialState: WorkoutState = {
  plans: [],
}

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    addWorkoutPlan: (state, action: PayloadAction<WorkoutPlan>) => {
      state.plans.push(action.payload)
    },
  },
})

export const { addWorkoutPlan } = workoutSlice.actions
export default workoutSlice.reducer

