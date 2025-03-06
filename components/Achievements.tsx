import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
  category: string
  progress?: number
  target?: number
}

interface AchievementsProps {
  achievements: Achievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  const [activeTab, setActiveTab] = useState("all")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const categories = ["all", "workout", "nutrition", "challenge", "streak"];

  const filteredAchievements = (activeTab === "all" 
    ? achievements 
    : achievements.filter(a => a.category === activeTab))
    .sort((a, b) => new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Track your progress and unlock new achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="h-[400px] w-full pr-4">
            <AnimatePresence>
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          <span className="mr-2 text-2xl">{achievement.icon}</span>
                          {achievement.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(achievement.dateEarned)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{achievement.description}</CardDescription>
                      {achievement.progress !== undefined && achievement.target !== undefined && (
                        <div className="mt-2">
                          <Progress value={(achievement.progress / achievement.target) * 100} className="w-full" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Progress: {achievement.progress} / {achievement.target}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}

