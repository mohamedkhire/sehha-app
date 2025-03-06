import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addProgressEntry } from '../store/actions'
import { awardPoints } from '../utils/pointsSystem'

const mockWearableData = {
  steps: 8500,
  caloriesBurned: 2100,
  heartRate: 72,
  sleepDuration: 7.5,
}

export function WearableIntegration() {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>()
  const dispatch = useDispatch()

  const handleConnect = () => {
    // In a real app, this would initiate the connection process with the wearable device
    console.log(`Connecting to ${selectedDevice}...`)
    
    // Simulating data sync
    setTimeout(() => {
      const progressEntry: ProgressEntry = {
        date: new Date().toISOString(),
        steps: mockWearableData.steps,
        caloriesBurned: mockWearableData.caloriesBurned,
        averageHeartRate: mockWearableData.heartRate,
        sleepDuration: mockWearableData.sleepDuration,
      }
      dispatch(addProgressEntry(progressEntry))
      awardPoints(dispatch, 'wearable_sync', 0)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wearable Device Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedDevice}>
          <SelectTrigger>
            <SelectValue placeholder="Select your device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fitbit">Fitbit</SelectItem>
            <SelectItem value="apple_watch">Apple Watch</SelectItem>
            <SelectItem value="garmin">Garmin</SelectItem>
            <SelectItem value="samsung_galaxy_watch">Samsung Galaxy Watch</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleConnect} disabled={!selectedDevice}>
          Connect and Sync Data
        </Button>
      </CardContent>
    </Card>
  )
}

