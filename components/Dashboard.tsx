'use client'

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Utensils, Dumbbell, LineChart, Trophy, Users, Bot, UserCircle, Camera, Clock, ChevronUp, ChevronDown, Weight, Ruler, Droplet, Moon } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { addProgressEntry } from '../store/slices/progressSlice'
import { addNutritionEntry } from '../store/slices/nutritionSlice'
import { addWorkoutPlan } from '../store/slices/workoutSlice'
import { completeChallenge, addChallenge, switchChallenges } from '../store/slices/challengeSlice'
import { addPost } from '../store/slices/socialSlice'
import { updateUserProfile, updateAchievements } from '../store/slices/userSlice'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { AchievementShowcase } from './AchievementShowcase'
import { ErrorBoundary } from 'react-error-boundary'
// import { HealthMetrics } from './HealthMetrics'
import { DailyProgress } from './DailyProgress'
import { PersonalizedPlans } from './PersonalizedPlans'
import { DailyChallenges } from './DailyChallenges'
import { Progress } from "@/components/ui/progress"
import { WelcomeCard } from './WelcomeCard'
import { StatsCard } from './StatsCard'
import { GoalsCard } from './GoalsCard'
import { AchievementsCard } from './AchievementsCard'

// Lazy-loaded components
const NutritionTracker = lazy(() => import('./NutritionTracker').then(mod => ({ default: mod.NutritionTracker })))
const WorkoutPlanner = lazy(() => import('./WorkoutPlanner').then(mod => ({ default: mod.WorkoutPlanner })))
const AIAssistant = lazy(() => import('./AIAssistant').then(mod => ({ default: mod.AIAssistant })))
const SocialFeed = lazy(() => import('./SocialFeed').then(mod => ({ default: mod.SocialFeed })))
const UserProfileUpdate = lazy(() => import('./UserProfileUpdate').then(mod => ({ default: mod.UserProfileUpdate })))
const ProgressPhotoComparison = lazy(() => import('./ProgressPhotoComparison').then(mod => ({ default: mod.ProgressPhotoComparison })))
const WorkoutTimer = lazy(() => import('./WorkoutTimer').then(mod => ({ default: mod.WorkoutTimer })))
const ProgressHistory = lazy(() => import('./ProgressHistory').then(mod => ({ default: mod.ProgressHistory })))

const challengeTemplates = [
  {
    id: '',
    title: 'Drink 8 glasses of water',
    description: 'Drink 8 glasses of water throughout the day',
    completed: false,
    difficulty: 'easy',
    target: 8
  },
  {
    id: '',
    title: 'Eat 5 servings of vegetables',
    description: 'Include 5 servings of vegetables in your meals today',
    completed: false,
    difficulty: 'medium',
    target: 5
  },
  {
    id: '',
    title: 'Meditate for 10 minutes',
    description: 'Practice mindfulness meditation for 10 minutes',
    completed: false,
    difficulty: 'easy',
    target: 10
  },
  {
    id: '',
    title: 'Go for a 30-minute walk',
    description: 'Take a brisk walk for at least 30 minutes',
    completed: false,
    difficulty: 'medium',
    target: 30
  },
  {
    id: '',
    title: 'Do 20 push-ups',
    description: 'Complete 2 sets of 10 push-ups',
    completed: false,
    difficulty: 'hard',
    target: 20
  },
  {
    id: '',
    title: 'Stretch for 15 minutes',
    description: 'Perform a full-body stretching routine',
    completed: false,
    difficulty: 'easy',
    target: 15
  },
  {
    id: '',
    title: 'Eat a healthy breakfast',
    description: 'Start your day with a nutritious breakfast',
    completed: false,
    difficulty: 'medium',
    target: 1
  },
  {
    id: '',
    title: 'Take the stairs',
    description: 'Use stairs instead of elevators throughout the day',
    completed: false,
    difficulty: 'medium',
    target: 5
  },
  {
    id: '',
    title: 'Practice good posture',
    description: 'Be mindful of your posture throughout the day',
    completed: false,
    difficulty: 'easy',
    target: 1
  },
  {
    id: '',
    title: 'Get 8 hours of sleep',
    description: 'Ensure you get a full 8 hours of sleep tonight',
    completed: false,
    difficulty: 'medium',
    target: 8
  }
]

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div role="alert" className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
      <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong</h2>
      <p className="mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}

interface DashboardProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Dashboard({ activeTab, setActiveTab }: DashboardProps) {
  const [challenges, setChallenges] = useState(challengeTemplates)
  const [isLoading, setIsLoading] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const { toast } = useToast()
  const dispatch = useDispatch()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const userData = useSelector((state: RootState) => state.user)
  const progressHistory = useSelector((state: RootState) => state.progress.history)
  const nutritionHistory = useSelector((state: RootState) => state.nutrition.history)
  const workoutPlans = useSelector((state: RootState) => state.workout.plans)
  const posts = useSelector((state: RootState) => state.social.posts)

  const [dailyWaterIntake, setDailyWaterIntake] = useState(0)
  const [dailySleepDuration, setDailySleepDuration] = useState(0)
  // const [dailyCaloriesConsumed, setDailyCaloriesConsumed] = useState(0)

  useEffect(() => {
    const storedAchievements = localStorage.getItem('userAchievements')
    if (storedAchievements) {
      dispatch(updateAchievements(JSON.parse(storedAchievements)))
    }
    generateDailyChallenges()
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [dispatch])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      setShowScrollButton(scrollY > windowHeight / 2)
      setScrollDirection(scrollY + windowHeight >= documentHeight - 100 ? 'up' : 'down')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    
    // Calculate daily water intake
    const todayWaterIntake = progressHistory
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.waterIntake, 0)
    setDailyWaterIntake(todayWaterIntake)

    // Calculate daily sleep duration
    const todaySleepDuration = progressHistory
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.sleepDuration, 0)
    setDailySleepDuration(todaySleepDuration)

    // Calculate daily calories consumed from nutrition tracker
    // const todayCaloriesConsumed = nutritionHistory
    //   .filter(entry => entry.date === today)
    //   .reduce((total, entry) => total + entry.foodItems.reduce((mealTotal, food) => mealTotal + food.calories, 0), 0)
    // setDailyCaloriesConsumed(todayCaloriesConsumed)
  }, [progressHistory, nutritionHistory])

  useEffect(() => {
    // This effect will run whenever activeTab changes
    // You can add any additional logic here if needed
  }, [activeTab])

  const generateDailyChallenges = () => {
    const newChallenges = challengeTemplates
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(challenge => ({ ...challenge, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) }))
    setChallenges(newChallenges)
  }

  const handleProgressUpdate = (progress: ProgressEntry) => {
    dispatch(addProgressEntry(progress))
    checkForAchievements(progress)
    toast({
      title: "Progress Updated",
      description: "Your daily progress has been recorded.",
    })
  }

  const handleNutritionUpdate = (nutrition: NutritionEntry) => {
    dispatch(addNutritionEntry(nutrition))
    toast({
      title: "Nutrition Logged",
      description: "Your meal has been added to your nutrition history.",
    })
  }

  const handleWorkoutUpdate = (workout: WorkoutPlan) => {
    dispatch(addWorkoutPlan(workout))
    checkForWorkoutAchievements(workout)
    toast({
      title: "Workout Plan Created",
      description: "Your new workout plan has been saved.",
    })
  }

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    dispatch(updateUserProfile(updatedProfile))
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated.",
    })
  }

  const handleChallengeComplete = (challengeId: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => 
        challenge.id === challengeId ? { ...challenge, completed: true } : challenge
      )
    )
    const challenge = challenges.find(c => c.id === challengeId)
    if (challenge) {
      handleAchievement({
        id: Date.now().toString(),
        title: `Challenge Completed`,
        description: `Completed: ${challenge.title}`,
        icon: '🏆',
        dateEarned: new Date().toISOString(),
        category: 'challenge'
      })
    }
    toast({
      title: "Challenge Completed",
      description: "Congratulations on completing a challenge!",
    })
  }

  const handleNewPost = (post: Omit<SocialPost, 'id' | 'likes' | 'comments'>) => {
    const newPost: SocialPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      comments: []
    }
    dispatch(addPost(newPost))
    toast({
      title: "Post Created",
      description: "Your post has been shared with the community.",
    })
  }

  const handleAchievement = (achievement: Achievement) => {
    const updatedAchievements = [...(userData.achievements || []), achievement]
    dispatch(updateAchievements(updatedAchievements))
    localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements))
    toast({
      title: "New Achievement",
      description: `You've earned the "${achievement.title}" achievement!`,
    })
  }

  const checkForAchievements = (progress: ProgressEntry) => {
    const lastEntry = progressHistory[progressHistory.length - 1]
    
    if (progress.weight) {
      handleAchievement({
        id: Date.now().toString(),
        title: 'Weight Update',
        description: `You've logged a new weight of ${progress.weight} kg!`,
        icon: '⚖️',
        dateEarned: new Date().toISOString(),
        category: 'weight',
        weightValue: progress.weight
      })
    }

    if (progress.caloriesBurned && (!lastEntry || progress.caloriesBurned > lastEntry.caloriesBurned)) {
      handleAchievement({
        id: Date.now().toString(),
        title: 'Calorie Burning Champion',
        description: `You've burned a record ${progress.caloriesBurned} calories!`,
        icon: '🔥',
        dateEarned: new Date().toISOString(),
        category: 'calories',
        caloriesBurned: progress.caloriesBurned
      })
    }

    if (progress.waterIntake > 0 && (!lastEntry || progress.waterIntake > lastEntry.waterIntake)) {
      handleAchievement({
        id: Date.now().toString(),
        title: 'Hydration Hero',
        description: `You've increased your water intake to ${progress.waterIntake} ml!`,
        icon: '💧',
        dateEarned: new Date().toISOString(),
        category: 'water',
        waterIntake: progress.waterIntake
      })
    }

    if (progress.sleepDuration > 0 && (!lastEntry || progress.sleepDuration > lastEntry.sleepDuration)) {
      handleAchievement({
        id: Date.now().toString(),
        title: 'Sleep Champion',
        description: `You've improved your sleep duration to ${progress.sleepDuration} hours!`,
        icon: '😴',
        dateEarned: new Date().toISOString(),
        category: 'sleep',
        sleepDuration: progress.sleepDuration
      })
    }

    if (progress.workoutsCompleted > 0) {
      handleAchievement({
        id: Date.now().toString(),
        title: 'Workout Completed',
        description: `Completed ${progress.workoutsCompleted} workout(s)`,
        icon: '💪',
        dateEarned: new Date().toISOString(),
        category: 'workout'
      })
    }
  }

  const checkForWorkoutAchievements = (workout: WorkoutPlan) => {
    const maxWeight = Math.max(...workout.exercises.map(e => e.weight || 0))
    if (maxWeight > (userData.maxLiftWeight || 0)) {
      handleAchievement({
        id: Date.now().toString(),
        title: 'New Personal Best',
        description: `Lifted ${maxWeight}kg, a new personal record!`,
        icon: '🏋️‍♂️',
        dateEarned: new Date().toISOString(),
        category: 'workout'
      })
      dispatch(updateUserProfile({ ...userData, maxLiftWeight: maxWeight }))
    }
  }

  const handleSwitchChallenges = () => {
    generateDailyChallenges()
    toast({
      title: "Challenges Updated",
      description: "New challenges are now available!",
    })
  }

  const aiTemplates = [
    "How can I improve my diet?",
    "What are some good exercises for beginners?",
    "How can I stay motivated with my fitness goals?",
    "What should I eat before and after a workout?",
    "How can I improve my sleep quality?",
  ]

  const daysUntilGoal = () => {
    if (!userData.goalDate) return null
    const today = new Date()
    const goalDate = new Date(userData.goalDate)
    const diffTime = Math.abs(goalDate.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleScroll = () => {
    if (scrollDirection === 'down') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const calculateBMI = (height: number, weight: number): number => {
    return weight / ((height / 100) ** 2)
  }

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal weight"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  const getBMICategoryColor = (bmi: number): string => {
    if (bmi < 18.5 || bmi >= 30) return "text-red-500"
    if (bmi < 25) return "text-green-500"
    return "text-yellow-500"
  }

  const calculateDailyCalories = (nutritionHistory: NutritionEntry[]): number => {
    const today = new Date().toISOString().split('T')[0];
    return nutritionHistory
      .filter(entry => entry.date.startsWith(today))
      .reduce((total, entry) => total + entry.foodItems.reduce((mealTotal, food) => mealTotal + food.calories, 0), 0);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <WelcomeCard userData={userData} daysUntilGoal={daysUntilGoal()}/>
            <div className="grid gap-6 md:grid-cols-2">
              <StatsCard userData={userData} dailyWaterIntake={dailyWaterIntake} dailySleepDuration={dailySleepDuration} nutritionHistory={nutritionHistory}/>
              <DailyProgress onProgressUpdate={handleProgressUpdate} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <DailyChallenges
                challenges={challenges}
                onComplete={handleChallengeComplete}
                onSwitchChallenges={handleSwitchChallenges}
              />
              <AchievementsCard achievements={userData.achievements || []} onNewAchievement={handleAchievement}/>
            </div>
          </motion.div>
        );
      case "nutrition":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <NutritionTracker 
                nutritionHistory={nutritionHistory}
                onNutritionUpdate={handleNutritionUpdate}
              />
            </Suspense>
          </ErrorBoundary>
        );
      case "workouts":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <WorkoutPlanner 
                workoutPlans={workoutPlans}
                onWorkoutUpdate={handleWorkoutUpdate}
                userHealthScore={userData.healthScore}
              />
            </Suspense>
          </ErrorBoundary>
        );
      case "progress":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <ProgressHistory 
                progressHistory={progressHistory}
                onProgressUpdate={handleProgressUpdate}
              />
            </Suspense>
          </ErrorBoundary>
        );
      case "social":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <SocialFeed 
                posts={posts} 
                onNewPost={handleNewPost}
                currentUser={userData}
              />
            </Suspense>
          </ErrorBoundary>
        );
      case "ai":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <AIAssistant userData={userData} templates={aiTemplates} />
            </Suspense>
          </ErrorBoundary>
        );
      case "profile":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <UserProfileUpdate 
                userData={userData}
                onProfileUpdate={handleProfileUpdate}
              />
            </Suspense>
          </ErrorBoundary>
        );
      case "photos":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <ProgressPhotoComparison userData={userData} />
            </Suspense>
          </ErrorBoundary>
        );
      case "timer":
        return (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <WorkoutTimer />
            </Suspense>
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  const renderDashboard = () => {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">{tabItems.find(item => item.value === activeTab)?.label}</h1>
        {renderTabContent()}
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    )
  }

  const tabItems = [
    { value: "overview", icon: Activity, label: "Overview" },
    { value: "nutrition", icon: Utensils, label: "Nutrition" },
    { value: "workouts", icon: Dumbbell, label: "Workouts" },
    { value: "progress", icon: LineChart, label: "Progress" },
    { value: "social", icon: Users, label: "Social" },
    { value: "ai", icon: Bot, label: "AI Assistant" },
    { value: "profile", icon: UserCircle, label: "Profile" },
    { value: "photos", icon: Camera, label: "Photos" },
    { value: "timer", icon: Clock, label: "Workout Timer" },
  ];

  const announce = (message: string) => {
    const announcement = new SpeechSynthesisUtterance(message)
    speechSynthesis.speak(announcement)
  }

  return (
    <div className="space-y-6">
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        <AnimatePresence mode="wait">
          {renderDashboard()}
        </AnimatePresence>
      </main>
      
      {showScrollButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            className="fixed bottom-4 right-4 rounded-full p-2"
            onClick={handleScroll}
            aria-label={scrollDirection === 'down' ? 'Scroll to bottom' : 'Scroll to top'}
          >
            {scrollDirection === 'down' ? <ChevronDown className="h-6 w-6" /> : <ChevronUp className="h-6 w-6" />}
          </Button>
        </motion.div>
      )}
    </div>
  )
}

function calculateDailyCalories(userData: UserProfile): number {
  const basalMetabolicRate = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + (userData.gender === 'male' ? 5 : -161)
  const activityFactors = {
    sedentary: 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'extra active': 1.9,
  }
  const activityFactor = activityFactors[userData.activityLevel as keyof typeof activityFactors] || 1.2
  return Math.round(basalMetabolicRate * activityFactor)
}

