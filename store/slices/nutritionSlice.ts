import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isEgyptian: boolean;
}

interface NutritionEntry {
  id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: FoodItem[];
}

interface NutritionState {
  history: NutritionEntry[];
}

const initialState: NutritionState = {
  history: [],
}

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    addNutritionEntry: (state, action: PayloadAction<NutritionEntry>) => {
      state.history.push(action.payload)
    },
  },
})

export const { addNutritionEntry } = nutritionSlice.actions
export default nutritionSlice.reducer

