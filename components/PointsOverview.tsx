import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PointsOverview() {
  const points = useSelector((state: RootState) => state.points)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Fitness Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary">{points.total}</div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Recent Points Activity:</h3>
          <ul className="space-y-2">
            {points.history.slice(-5).reverse().map((entry, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{entry.points} points</span> - {entry.reason}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

