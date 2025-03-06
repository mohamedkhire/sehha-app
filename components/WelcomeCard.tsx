import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface WelcomeCardProps {
  userData: UserProfile
  daysUntilGoal: number | null
}

export function WelcomeCard({ userData, daysUntilGoal }: WelcomeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pb-8 pt-6">
        <CardTitle className="text-3xl">
          {userData.name ? `Welcome back, ${userData.name}!` : 'Welcome to HealthFitnessApp!'}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative pt-6">
        <motion.div
          className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
        <p className="text-xl font-semibold text-primary mb-2">Let's achieve your fitness goals today!</p>
        {daysUntilGoal && (
          <p className="text-lg">
            <span className="font-semibold text-green-500">{daysUntilGoal}</span>
            <span className="text-green-500"> days left to reach your goal</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

