import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from 'lucide-react'

export function StreakDisplay() {
  const streak = useSelector((state: RootState) => state.streak.currentStreak)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className="w-6 h-6 text-orange-500 mr-2" />
          Your Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-orange-500">{streak} days</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep up the great work! Consistency is key to achieving your fitness goals.
        </p>
      </CardContent>
    </Card>
  )
}

