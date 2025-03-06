import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProgressEntry {
  date: string;
  weight: number;
  workoutsCompleted: number;
  waterIntake: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  sleepDuration: number;
  customActivities?: Array<{
    name: string;
    duration: number;
    caloriesBurned: number;
  }>;
}

interface ProgressHistoryProps {
  progressHistory: ProgressEntry[];
  onProgressUpdate: (progress: ProgressEntry) => void;
}

export function ProgressHistory({ progressHistory, onProgressUpdate }: ProgressHistoryProps) {
  const [timeFrame, setTimeFrame] = useState('month')
  const [metric, setMetric] = useState('weight')
  const [customActivity, setCustomActivity] = useState({ name: '', duration: 0, caloriesBurned: 0 })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getFilteredData = () => {
    const now = new Date()
    const timeFrames = {
      week: 7,
      month: 30,
      year: 365
    }
    const cutoffDate = new Date(now.setDate(now.getDate() - timeFrames[timeFrame as keyof typeof timeFrames]))
    return progressHistory.filter(entry => new Date(entry.date) >= cutoffDate)
  }

  const filteredData = getFilteredData()

  const getChartData = () => {
    return filteredData.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      [metric]: entry[metric as keyof ProgressEntry],
      average: calculateMovingAverage(entry.date, metric as keyof ProgressEntry)
    }))
  }

  const calculateMovingAverage = (date: string, metric: keyof ProgressEntry) => {
    const index = progressHistory.findIndex(entry => entry.date === date)
    const window = progressHistory.slice(Math.max(0, index - 6), index + 1)
    const sum = window.reduce((acc, entry) => acc + (entry[metric] as number), 0)
    return sum / window.length
  }

  const chartData = getChartData()

  const metricOptions = [
    { value: 'weight', label: 'Weight' },
    { value: 'workoutsCompleted', label: 'Workouts Completed' },
    { value: 'waterIntake', label: 'Water Intake' },
    { value: 'caloriesConsumed', label: 'Calories Consumed' },
    { value: 'caloriesBurned', label: 'Calories Burned' },
    { value: 'sleepDuration', label: 'Sleep Duration' },
  ]

  const handleCustomActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomActivity(prev => ({ ...prev, [name]: name === 'name' ? value : Number(value) }))
  }

  const handleAddCustomActivity = () => {
    if (customActivity.name && customActivity.duration > 0) {
      const today = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0]
      const existingEntry = progressHistory.find(entry => entry.date === today)
      
      if (existingEntry) {
        const updatedEntry = {
          ...existingEntry,
          customActivities: [...(existingEntry.customActivities || []), customActivity]
        }
        onProgressUpdate(updatedEntry)
      } else {
        const newEntry: ProgressEntry = {
          date: today,
          weight: 0,
          workoutsCompleted: 0,
          waterIntake: 0,
          caloriesConsumed: 0,
          caloriesBurned: 0,
          sleepDuration: 0,
          customActivities: [customActivity]
        }
        onProgressUpdate(newEntry)
      }
      
      setCustomActivity({ name: '', duration: 0, caloriesBurned: 0 })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progress History</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between mb-4">
            <Select onValueChange={setTimeFrame} defaultValue={timeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setMetric} defaultValue={metric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey={metric} stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="average" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Custom Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Input 
                  placeholder="Activity name" 
                  name="name" 
                  value={customActivity.name} 
                  onChange={handleCustomActivityChange} 
                />
                <Input 
                  placeholder="Duration (min)" 
                  name="duration" 
                  type="number" 
                  value={customActivity.duration || ''} 
                  onChange={handleCustomActivityChange} 
                />
                <Input 
                  placeholder="Calories burned" 
                  name="caloriesBurned" 
                  type="number" 
                  value={customActivity.caloriesBurned || ''} 
                  onChange={handleCustomActivityChange} 
                />
              </div>
              <div className="flex space-x-4 mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={handleAddCustomActivity}>Add Activity</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Duration (min)</TableHead>
                      <TableHead>Calories Burned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {progressHistory
                        .flatMap(entry => 
                          (entry.customActivities || []).map(activity => ({
                            date: entry.date,
                            ...activity
                          }))
                        )
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 10)
                        .map((activity, index) => (
                          <motion.tr 
                            key={`${activity.date}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                            <TableCell>{activity.name}</TableCell>
                            <TableCell>{activity.duration}</TableCell>
                            <TableCell>{activity.caloriesBurned}</TableCell>
                          </motion.tr>
                        ))
                      }
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </CardContent>
    </Card>
  )
}

