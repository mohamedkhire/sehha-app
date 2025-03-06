import React from 'react'
import { Progress } from "@/components/ui/progress"
import { Weight, Ruler, Activity, Utensils, Droplet, Moon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HealthMetricsProps {
  userData: UserProfile
}

export function HealthMetrics({ userData }: HealthMetricsProps) {
  const nutritionHistory = useSelector((state: RootState) => state.nutrition.history)
  const progressHistory = useSelector((state: RootState) => state.progress.history)

  const calculateBMI = () => {
    const heightInMeters = userData.height / 100
    return (userData.weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const bmi = parseFloat(calculateBMI())
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-yellow-500" }
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" }
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" }
    return { category: "Obese", color: "text-red-500" }
  }

  const { category, color } = getBMICategory(bmi)

  const calculateCaloriesConsumed = () => {
    const today = new Date().toISOString().split('T')[0]
    return nutritionHistory
      .filter(entry => entry.date.startsWith(today))
      .reduce((total, entry) => total + entry.foodItems.reduce((mealTotal, food) => mealTotal + (food.calories || 0), 0), 0)
  }

  const caloriesConsumed = calculateCaloriesConsumed()

  const getLatestProgress = () => {
    if (progressHistory.length === 0) return null
    return progressHistory[progressHistory.length - 1]
  }

  const latestProgress = getLatestProgress()

  const metricCards = [
    { title: "Weight", value: userData.weight && !isNaN(userData.weight) ? `${userData.weight} kg` : 'N/A', icon: Weight, color: "bg-blue-500" },
    { title: "Height", value: userData.height && !isNaN(userData.height) ? `${userData.height} cm` : 'N/A', icon: Ruler, color: "bg-green-500" },
    { title: "BMI", value: bmi.toString(), icon: Activity, color: "bg-yellow-500" },
    { title: "Calories", value: `${caloriesConsumed} kcal`, icon: Utensils, color: "bg-red-500" },
    { title: "Water Intake", value: `${latestProgress?.waterIntake || 0} ml`, icon: Droplet, color: "bg-blue-300" },
    { title: "Sleep", value: `${latestProgress?.sleepDuration || 0} hrs`, icon: Moon, color: "bg-indigo-500" },
  ]

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {metricCards.map((metric, index) => (
        <TooltipProvider key={metric.title}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className={`${metric.color} p-2`}>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="text-sm">{metric.title}</span>
                      <metric.icon className="h-4 w-4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your current {metric.title.toLowerCase()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <Card className="col-span-2 md:col-span-3 lg:col-span-6">
        <CardHeader>
          <CardTitle>BMI Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-lg font-semibold ${color}`}>{category}</p>
          <Progress 
            value={bmi !== 'N/A' ? Math.min((parseFloat(bmi) / 40) * 100, 100) : 0} 
            className="mt-2" 
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

