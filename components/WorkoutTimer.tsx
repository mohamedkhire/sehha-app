import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { setTimerState, resetTimer } from '../store/slices/timerSlice'
import { RootState } from '../store'

export function WorkoutTimer() {
  const dispatch = useDispatch()
  const { time, isActive, endTime } = useSelector((state: RootState) => state.timer)
  const [inputTime, setInputTime] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive && endTime) {
        const currentTime = Date.now()
        const remainingTime = Math.max(0, Math.floor((endTime - currentTime) / 1000))
        dispatch(setTimerState({ time: remainingTime, isActive: remainingTime > 0 }))

        if (remainingTime === 0) {
          toast({
            title: "Timer Completed",
            description: "Your workout timer has finished!",
          })
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, endTime, dispatch, toast])

  const toggleTimer = () => {
    if (!isActive && time > 0) {
      const newEndTime = Date.now() + time * 1000
      dispatch(setTimerState({ isActive: true, endTime: newEndTime }))
    } else {
      dispatch(setTimerState({ isActive: false }))
    }
  }

  const handleResetTimer = () => {
    dispatch(resetTimer())
    setInputTime('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTime(e.target.value)
  }

  const startTimer = () => {
    const seconds = parseInt(inputTime) * 60
    if (seconds > 0) {
      const newEndTime = Date.now() + seconds * 1000
      dispatch(setTimerState({ time: seconds, isActive: true, endTime: newEndTime }))
    }
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Workout Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={time}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="text-6xl font-bold text-center"
          >
            {formatTime(time)}
          </motion.div>
        </AnimatePresence>
        <div className="flex space-x-2">
          <Button onClick={toggleTimer} className="flex-1">
            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={handleResetTimer} variant="outline" className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timer-input">Set Timer (minutes)</Label>
          <div className="flex space-x-2">
            <Input
              id="timer-input"
              type="number"
              value={inputTime}
              onChange={handleInputChange}
              placeholder="Enter time in minutes"
            />
            <Button onClick={startTimer}>Set</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

