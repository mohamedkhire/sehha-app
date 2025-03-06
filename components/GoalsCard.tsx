import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from 'lucide-react'

interface GoalsCardProps {
  userData: UserProfile
}

export function GoalsCard({ userData }: GoalsCardProps) {
  // This is a placeholder function. In a real app, you'd calculate the actual progress.
  const calculateProgress = (goal: string) => Math.random() * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Your Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userData.fitnessGoals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{goal}</span>
              <span className="text-sm font-medium">{Math.round(calculateProgress(goal))}%</span>
            </div>
            <Progress value={calculateProgress(goal)} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

