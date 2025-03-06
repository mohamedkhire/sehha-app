import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface Challenge {
  id: string
  title: string
  description: string
  completed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  target: number
  currentProgress: number
}

interface DailyChallengesProps {
  challenges: Challenge[]
  onComplete: (challengeId: string) => void
  onSwitchChallenges: () => void
}

export function DailyChallenges({ challenges, onComplete, onSwitchChallenges }: DailyChallengesProps) {
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState<{ [key: string]: number }>({})

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : challenges.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < challenges.length - 1 ? prevIndex + 1 : 0))
  }

  const handleComplete = (challengeId: string) => {
    setProgress(prev => ({ ...prev, [challengeId]: 100 }))
    onComplete(challengeId)
    toast({
      title: "Challenge Completed!",
      description: "Great job on completing the challenge!",
    })
  }

  const handleProgressUpdate = (challengeId: string, newProgress: number) => {
    setProgress(prev => ({ ...prev, [challengeId]: newProgress }))
    if (newProgress >= 100) {
      handleComplete(challengeId)
    }
  }

  const currentChallenge = challenges[currentIndex]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Challenges</span>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {currentChallenge && (
            <motion.div
              key={currentChallenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-lg">{currentChallenge.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{currentChallenge.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={currentChallenge.difficulty === 'easy' ? 'secondary' : currentChallenge.difficulty === 'medium' ? 'default' : 'destructive'}>
                    {currentChallenge.difficulty}
                  </Badge>
                  <span className="text-sm font-medium">
                    Progress: {progress[currentChallenge.id] || 0}%
                  </span>
                </div>
                <Progress 
                  value={progress[currentChallenge.id] || 0} 
                  className="w-full mb-4" 
                />
                <div className="flex justify-between items-center">
                  <Button 
                    onClick={() => handleProgressUpdate(currentChallenge.id, Math.min((progress[currentChallenge.id] || 0) + 10, 100))}
                    disabled={currentChallenge.completed || (progress[currentChallenge.id] || 0) >= 100}
                  >
                    Update Progress
                  </Button>
                  <Button 
                    onClick={() => handleComplete(currentChallenge.id)} 
                    disabled={currentChallenge.completed}
                    variant="outline"
                  >
                    {currentChallenge.completed ? 'Completed' : 'Complete'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {challenges.length}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onSwitchChallenges} variant="outline" className="w-full mt-4">
          Get New Challenges
        </Button>
      </CardContent>
    </Card>
  )
}

