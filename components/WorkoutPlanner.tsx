import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExerciseVideo } from './ExerciseVideo'
import { WorkoutHistory } from './WorkoutHistory'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Search, Filter } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { setNumberInputConstraints } from '../utils/inputConstraints'

interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  exercises: Array<{ exercise: Exercise; sets: number; reps: number; weight?: number }>;
  date: string;
}

interface Exercise {
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  videoUrl: string;
}

interface WorkoutPlannerProps {
  workoutPlans: WorkoutPlan[]
  onWorkoutUpdate: (workout: WorkoutPlan) => void
  userHealthScore: number
}

const exerciseDatabase: Exercise[] = [
  { name: 'Push-ups', category: 'Strength', muscleGroup: 'Chest', equipment: 'Bodyweight', difficulty: 'beginner', videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4' },
  { name: 'Squats', category: 'Strength', muscleGroup: 'Legs', equipment: 'Bodyweight', difficulty: 'beginner', videoUrl: 'https://www.youtube.com/embed/YaXPRqUwItQ' },
  { name: 'Plank', category: 'Core', muscleGroup: 'Abs', equipment: 'Bodyweight', difficulty: 'beginner', videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
  { name: 'Bench Press', category: 'Strength', muscleGroup: 'Chest', equipment: 'Barbell', difficulty: 'intermediate', videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
  { name: 'Deadlift', category: 'Strength', muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'advanced', videoUrl: 'https://www.youtube.com/embed/r4MzxtBKyNE' },
  { name: 'Pull-ups', category: 'Strength', muscleGroup: 'Back', equipment: 'Pull-up Bar', difficulty: 'intermediate', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
  { name: 'Lunges', category: 'Strength', muscleGroup: 'Legs', equipment: 'Bodyweight', difficulty: 'beginner', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
  { name: 'Dumbbell Rows', category: 'Strength', muscleGroup: 'Back', equipment: 'Dumbbells', difficulty: 'intermediate', videoUrl: 'https://www.youtube.com/embed/roCP6wCXPqo' },
  { name: 'Burpees', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'intermediate', videoUrl: 'https://www.youtube.com/embed/dZgVxmf6jkA' },
  { name: 'Mountain Climbers', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'beginner', videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM' },
]

export function WorkoutPlanner({ workoutPlans = [], onWorkoutUpdate, userHealthScore }: WorkoutPlannerProps) {
  const [planName, setPlanName] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<Array<{ exercise: Exercise; sets: number; reps: number; weight?: number }>>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredExercises = exerciseDatabase.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'all' || exercise.category === filterCategory) &&
    (filterDifficulty === 'all' || exercise.difficulty === filterDifficulty)
  )

  const handleAddExercise = (exercise: Exercise) => {
    const recommendedSets = Math.max(1, Math.min(5, Math.floor(userHealthScore / 20)))
    const recommendedReps = Math.max(5, Math.min(15, Math.floor(userHealthScore / 10)))
    setSelectedExercises(prev => [...prev, { exercise, sets: recommendedSets, reps: recommendedReps }])
    setIsDialogOpen(false)
  }

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (index: number, field: 'sets' | 'reps' | 'weight', value: number) => {
    setSelectedExercises(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: setNumberInputConstraints({ target: { value: value.toString() } } as React.ChangeEvent<HTMLInputElement>, 1, field === 'weight' ? 1000 : 100) } : item
    ))
  }

  const handleSubmit = () => {
    if (planName && selectedExercises.length > 0) {
      const newWorkout: WorkoutPlan = {
        id: Date.now().toString(),
        userId: '1', // Replace with actual user ID
        name: planName,
        exercises: selectedExercises,
        date: new Date().toISOString()
      }
      onWorkoutUpdate(newWorkout)
      setPlanName('')
      setSelectedExercises([])
    }
  }

  const handleRepeatWorkout = (workout: WorkoutPlan) => {
    setPlanName(`${workout.name} (Repeat)`)
    setSelectedExercises(workout.exercises)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              placeholder="Workout Plan Name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Exercise</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="text-muted-foreground" />
                    <Input
                      placeholder="Search for exercise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Select onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Core">Core</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setFilterDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <AnimatePresence>
                      {filteredExercises.map((exercise, index) => (
                        <motion.div 
                          key={exercise.name}
                          className="flex justify-between items-center p-2 hover:bg-accent rounded-md"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <div className="flex space-x-2 mt-1">
                              <Badge variant="secondary">{exercise.category}</Badge>
                              <Badge variant="outline">{exercise.difficulty}</Badge>
                            </div>
                          </div>
                          <Button onClick={() => handleAddExercise(exercise)} size="sm">Add</Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            <div>
              <h3 className="font-semibold mb-2">Selected Exercises:</h3>
              <AnimatePresence>
                {selectedExercises.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-4 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{item.exercise.name}</h4>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveExercise(index)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor={`sets-${index}`}>Sets</Label>
                            <Input
                              id={`sets-${index}`}
                              type="number"
                              value={item.sets}
                              onChange={(e) => handleExerciseChange(index, 'sets', Number(e.target.value))}
                              min={1}
                              max={100}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`reps-${index}`}>Reps</Label>
                            <Input
                              id={`reps-${index}`}
                              type="number"
                              value={item.reps}
                              onChange={(e) => handleExerciseChange(index, 'reps', Number(e.target.value))}
                              min={1}
                              max={100}
                            />
                          </div>
                          {item.exercise.equipment !== 'Bodyweight' && (
                            <div>
                              <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                              <Input
                                id={`weight-${index}`}
                                type="number"
                                value={item.weight || 0}
                                onChange={(e) => handleExerciseChange(index, 'weight', Number(e.target.value))}
                                min={0}
                                max={1000}
                              />
                            </div>
                          )}
                        </div>
                        <ExerciseVideo exerciseName={item.exercise.name} videoUrl={item.exercise.videoUrl} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleSubmit} disabled={!planName || selectedExercises.length === 0} className="w-full">Save Workout Plan</Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
      <WorkoutHistory workoutPlans={workoutPlans} onRepeatWorkout={handleRepeatWorkout} />
    </div>
  )
}

