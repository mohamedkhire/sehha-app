interface UserProfile {
  id: string
  email: string
  name: string
  age: number
  gender: string
  height: number
  weight: number
  activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active' | 'extra active'
  fitnessGoals: string[]
  dietaryPreferences: string[]
  healthScore: number
}

interface ProgressEntry {
  date: string
  weight: number
  workoutsCompleted: number
  waterIntake: number
  caloriesConsumed: number
  caloriesBurned: number
  sleepDuration: number
  customActivities: {
    name: string
    duration: number
    caloriesBurned: number
  }[]
}

interface FoodItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  isEgyptian: boolean
}

interface NutritionEntry {
  id: string
  userId: string
  date: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foodItems: FoodItem[]
}

interface Exercise {
  name: string
  category: string
  muscleGroup: string
  equipment: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface WorkoutPlan {
  id: string
  userId: string
  name: string
  exercises: {
    exercise: Exercise
    sets: number
    reps: number
    weight?: number
  }[]
  date: string
}

interface Challenge {
  id: string
  title: string
  description: string
  completed: boolean
  difficulty: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
  category: string
  weightValue?: number
  caloriesBurned?: number
}

interface SocialPost {
  id: string
  userId: string
  userName: string
  content: string
  image?: string
  likes: number
  comments: {
    userId: string
    userName: string
    content: string
    date: string
  }[]
  date: string
}

interface UserData extends UserProfile {
  progressHistory: ProgressEntry[]
  nutritionHistory: NutritionEntry[]
  workoutPlans: WorkoutPlan[]
  completedChallenges: string[]
  achievements: Achievement[]
  posts: SocialPost[]
}

interface AIAssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

