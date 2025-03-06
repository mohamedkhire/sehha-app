import React from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Challenge {
  id: string
  title: string
  description: string
  target: number
  currentProgress: number
  unit: string
  icon: string
  completed: boolean
}

interface ChallengesProps {
  challenges: Challenge[]
  onComplete: (challengeId: string) => void
  onSwitchChallenges: () => void
}

export function Challenges({ challenges, onComplete, onSwitchChallenges }: ChallengesProps) {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px]">
        {challenges.map(challenge => (
          <div key={challenge.id} className="bg-muted p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">{challenge.icon}</span>
                {challenge.title}
              </h3>
            </div>
            <p className="text-sm mb-2">{challenge.description}</p>
            <p className="text-sm mb-2">
              Progress: {challenge.currentProgress} / {challenge.target} {challenge.unit}
            </p>
            <Progress 
              value={(challenge.currentProgress / challenge.target) * 100} 
              className="mb-2" 
            />
            <Button 
              onClick={() => onComplete(challenge.id)} 
              size="sm"
              disabled={challenge.completed}
            >
              {challenge.completed ? 'Completed' : 'Complete'}
            </Button>
          </div>
        ))}
      </ScrollArea>
      <Button onClick={onSwitchChallenges} variant="outline" className="w-full">
        Get New Challenges
      </Button>
    </div>
  )
}

