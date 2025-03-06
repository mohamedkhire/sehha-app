import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { motion } from 'framer-motion'
import { Slider } from "@/components/ui/slider"
import { Activity, Droplet, Utensils, Dumbbell, Moon } from 'lucide-react'

interface DailyProgressProps {
  onProgressUpdate: (progress: ProgressEntry) => void
}

export function DailyProgress({ onProgressUpdate }: DailyProgressProps) {
  const [progress, setProgress] = useState<Partial<ProgressEntry>>({
    weight: 0,
    workoutsCompleted: 0,
    waterIntake: 0,
    caloriesConsumed: 0,
    caloriesBurned: 0,
    sleepDuration: 0
  })

  const handleChange = (name: string, value: number) => {
    setProgress(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onProgressUpdate({ ...progress, date: new Date().toISOString().split('T')[0] } as ProgressEntry)
  }

  const progressItems = [
    { name: 'weight', label: 'Weight (kg)', icon: Activity, min: 0, max: 200, step: 0.1 },
    { name: 'waterIntake', label: 'Water Intake (ml)', icon: Droplet, min: 0, max: 5000, step: 100 },
    { name: 'caloriesConsumed', label: 'Calories Consumed', icon: Utensils, min: 0, max: 5000, step: 50 },
    { name: 'caloriesBurned', label: 'Calories Burned', icon: Dumbbell, min: 0, max: 3000, step: 50 },
    { name: 'sleepDuration', label: 'Sleep Duration (hours)', icon: Moon, min: 0, max: 24, step: 0.5 },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Daily Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className="grid gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {progressItems.map((item) => (
              <div key={item.name} className="space-y-2">
                <Label htmlFor={item.name} className="flex items-center text-sm font-medium">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id={item.name}
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={[progress[item.name as keyof ProgressEntry] || 0]}
                    onValueChange={(value) => handleChange(item.name, value[0])}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    id={`${item.name}-input`}
                    value={progress[item.name as keyof ProgressEntry] || ''}
                    onChange={(e) => handleChange(item.name, Number(e.target.value))}
                    className="w-20"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                  />
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button type="submit" className="w-full">Log Progress</Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}

