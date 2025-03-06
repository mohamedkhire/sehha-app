import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExerciseVideoProps {
  exerciseName: string
  videoUrl: string
}

export function ExerciseVideo({ exerciseName, videoUrl }: ExerciseVideoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{exerciseName} Demonstration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={videoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-md"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  )
}

