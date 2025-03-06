/*
 * Project: Health-Fitness-app
 * Author: Mohamed Khire
 * Date: Jan 2025
 * Description: A health and fitness tracking app built with React and Next.js, designed to help users monitor their wellness journey.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://sehha-app.vercel.app/
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
}

interface AchievementShowcaseProps {
  achievements: Achievement[]
}

export function AchievementShowcase({ achievements }: AchievementShowcaseProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4 last:mb-0"
            >
              <Card>
                <CardContent className="flex items-center p-4">
                  <div className="text-4xl mr-4">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      {new Date(achievement.dateEarned).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

