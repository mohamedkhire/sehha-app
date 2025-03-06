import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from 'framer-motion'
import { Dumbbell, Utensils } from 'lucide-react'

interface PersonalizedPlansProps {
  userData: UserProfile
}

export function PersonalizedPlans({ userData }: PersonalizedPlansProps) {
  const generateWorkoutPlan = () => {
    if (userData.activityLevel === 'sedentary') {
      return [
        '20 minutes of brisk walking or light jogging, 5 times a week',
        'Basic strength training with bodyweight exercises, 2-3 times a week',
        '10 minutes of stretching daily',
        'Try yoga or Pilates once a week for flexibility and core strength'
      ]
    } else if (userData.activityLevel === 'moderately active') {
      return [
        '30 minutes of moderate cardio (jogging, cycling, swimming) 4 times a week',
        'Strength training with weights or resistance bands, 3 times a week',
        'High-Intensity Interval Training (HIIT) session once a week',
        '15 minutes of yoga or dynamic stretching daily'
      ]
    } else {
      return [
        '45 minutes of high-intensity cardio (running, cycling, swimming) 5 times a week',
        'Advanced strength training 4 times a week, focusing on compound exercises',
        'Two HIIT sessions per week for improved cardiovascular fitness',
        '20 minutes of mobility work and stretching daily',
        'Consider adding a sports-specific training session weekly'
      ]
    }
  }

  const generateDietPlan = () => {
    const basePlan = [
      'Aim for a balanced diet with 45-65% carbohydrates, 10-35% protein, and 20-35% fat',
      'Include a variety of colorful fruits and vegetables in every meal',
      'Choose whole grains over refined grains for better nutrition and fiber',
      'Stay hydrated by drinking at least 8 glasses of water daily',
      'Limit processed foods, sugary drinks, and excessive salt intake'
    ]

    if (userData.dietaryPreferences && userData.dietaryPreferences.includes('vegan')) {
      return [
        ...basePlan,
        'Focus on plant-based protein sources like legumes, tofu, tempeh, and seitan',
        'Include nuts and seeds for healthy fats and additional protein',
        'Consider B12, iron, and omega-3 supplements after consulting with a healthcare provider'
      ]
    } else if (userData.dietaryPreferences && userData.dietaryPreferences.includes('vegetarian')) {
      return [
        ...basePlan,
        'Include a variety of plant-based proteins and consider eggs and dairy for additional protein',
        'Ensure adequate intake of vitamin B12, iron, and zinc through fortified foods or supplements'
      ]
    } else {
      return [
        ...basePlan,
        'Include lean proteins like chicken, fish, and lean cuts of beef',
        'Incorporate fatty fish like salmon or mackerel twice a week for omega-3 fatty acids',
        'Limit red meat consumption to 1-2 times per week'
      ]
    }
  }

  const workoutPlan = generateWorkoutPlan()
  const dietPlan = generateDietPlan()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Personalized Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workout" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workout" className="flex items-center space-x-2">
              <Dumbbell className="w-4 h-4" />
              <span>Workout Plan</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center space-x-2">
              <Utensils className="w-4 h-4" />
              <span>Diet Plan</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="workout" className="h-[300px]">
            <ScrollArea className="h-full">
              <motion.ul 
                className="space-y-2 p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {workoutPlan.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="bg-muted p-2 rounded-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="diet" className="h-[300px]">
            <ScrollArea className="h-full">
              <motion.ul 
                className="space-y-2 p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {dietPlan.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="bg-muted p-2 rounded-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

