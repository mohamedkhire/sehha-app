import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from 'framer-motion'
import { Award, Scale, Flame, Droplet, Moon } from 'lucide-react'

interface AchievementsCardProps {
 achievements: Achievement[]
 onNewAchievement: (achievement: Achievement) => void
}

export function AchievementsCard({ achievements, onNewAchievement }: AchievementsCardProps) {
 // Sort achievements by date in descending order (newest first)
 const sortedAchievements = [...achievements].sort((a, b) => 
   new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime()
 )

 const getAchievementIcon = (achievement: Achievement) => {
   switch (achievement.category) {
     case 'weight':
       return <Scale className="w-6 h-6 text-blue-500" />
     case 'calories':
       return <Flame className="w-6 h-6 text-orange-500" />
     case 'water':
       return <Droplet className="w-6 h-6 text-blue-300" />
     case 'sleep':
       return <Moon className="w-6 h-6 text-indigo-500" />
     default:
       return <Award className="w-6 h-6 text-yellow-500" />
   }
 }

 const getMotivationalMessage = (achievement: Achievement) => {
   if (achievement.category === 'weight') {
     return `Great job! You've reached a new weight of ${achievement.weightValue} kg. Keep up the good work!`
   } else if (achievement.category === 'calories') {
     return `Wow! You burned ${achievement.caloriesBurned} calories. That's impressive!`
   } else if (achievement.category === 'water') {
     return `Awesome! You've increased your water intake to ${achievement.waterIntake} ml. Stay hydrated!`
   } else if (achievement.category === 'sleep') {
     return `Fantastic! You've improved your sleep duration to ${achievement.sleepDuration} hours. Rest well!`
   }
   return achievement.description
 }

 return (
   <Card>
     <CardHeader>
       <CardTitle>Recent Achievements</CardTitle>
     </CardHeader>
     <CardContent>
       <ScrollArea className="h-[300px] pr-4">
         {sortedAchievements.map((achievement, index) => (
           <motion.div
             key={achievement.id}
             className="mb-4 last:mb-0"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.05 }}
           >
             <div className="flex items-start space-x-4">
               <div className="mt-1">{getAchievementIcon(achievement)}</div>
               <div>
                 <h3 className="font-semibold">{achievement.title}</h3>
                 <p className="text-sm text-muted-foreground">{getMotivationalMessage(achievement)}</p>
                 <p className="text-xs text-muted-foreground mt-1">
                   {new Date(achievement.dateEarned).toLocaleDateString()}
                 </p>
               </div>
             </div>
           </motion.div>
         ))}
       </ScrollArea>
     </CardContent>
   </Card>
 )
}

