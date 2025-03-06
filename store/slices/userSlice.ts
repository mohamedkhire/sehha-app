import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  fitnessGoals: string[];
  dietaryPreferences: string[];
  healthScore: number;
  achievements: Achievement[];
  maxLiftWeight: number;
}

const initialState: UserProfile = {
  id: '',
  name: '',
  email: '',
  age: 0,
  gender: '',
  height: 0,
  weight: 0,
  activityLevel: '',
  fitnessGoals: [],
  dietaryPreferences: [],
  healthScore: 0,
  achievements: [],
  maxLiftWeight: 0,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      return { ...state, ...action.payload }
    },
    updateAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.achievements = action.payload
    },
    clearUser: () => initialState,
    setUser: (state, action: PayloadAction<UserProfile>) => action.payload,
  },
})

export const { updateUserProfile, updateAchievements, clearUser, setUser } = userSlice.actions
export default userSlice.reducer

