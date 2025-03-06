import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from 'framer-motion'
import { Repeat, ChevronRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  exercises: Array<{ exercise: { name: string }; sets: number; reps: number; weight?: number }>;
  date: string;
}

interface WorkoutHistoryProps {
  workoutPlans: WorkoutPlan[];WorkoutPlans: WorkoutPlan[];
  onRepeatWorkout: (workout: WorkoutPlan) => void;
}

export function WorkoutHistory({ workoutPlans, onRepeatWorkout }: WorkoutHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <AnimatePresence>
            {workoutPlans.map((workout) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{workout.name}</h3>
                      <Badge variant="outline">{new Date(workout.date).toLocaleDateString()}</Badge>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {workout.exercises.map((exercise, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{exercise.exercise.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {exercise.sets} x {exercise.reps}
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => onRepeatWorkout(workout)}
                      className="w-full"
                      variant="outline"
                    >
                      <Repeat className="w-4 h-4 mr-2" /> Repeat Workout
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

