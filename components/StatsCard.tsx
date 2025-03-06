import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardValue } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Utensils, Droplet, Moon, Weight, Ruler } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StatsCardProps {
  userData: UserProfile
  dailyWaterIntake: number
  dailySleepDuration: number
  nutritionHistory: NutritionEntry[]
}

export function StatsCard({ userData, dailyWaterIntake, dailySleepDuration, nutritionHistory }: StatsCardProps) {
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

  const bmi = calculateBMI(userData.height, userData.weight)
  const dailyCalories = calculateDailyCalories(nutritionHistory)

  const stats = [
    { label: 'Weight', value: `${userData.weight} kg`, icon: Weight, color: 'text-blue-500' },
    { label: 'Height', value: `${userData.height} cm`, icon: Ruler, color: 'text-green-500' },
    { label: 'Daily Calories', value: `${dailyCalories} kcal`, icon: Utensils, color: 'text-red-500' },
    { label: 'Water Intake', value: `${dailyWaterIntake} ml`, icon: Droplet, color: 'text-blue-300' },
    { label: 'Sleep', value: `${dailySleepDuration} hrs`, icon: Moon, color: 'text-indigo-500' },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-primary" />
          <span>Your Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <TooltipProvider key={stat.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <CardValue>{stat.value}</CardValue>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your current {stat.label.toLowerCase()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <CardValue className={getBMICategoryColor(bmi)}>{bmi.toFixed(1)}</CardValue>
              <span className={`font-semibold ${getBMICategoryColor(bmi)}`}>{getBMICategory(bmi)}</span>
            </div>
            <Progress value={(bmi / 40) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

