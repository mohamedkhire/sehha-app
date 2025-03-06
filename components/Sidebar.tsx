import React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Activity, Utensils, Dumbbell, LineChart, Users, Bot, UserCircle, Camera, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  toggleSidebar: () => void
}

export function Sidebar({ className, activeTab, setActiveTab, isOpen, toggleSidebar }: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const items = [
    { value: "overview", icon: Activity, label: "Overview" },
    { value: "nutrition", icon: Utensils, label: "Nutrition" },
    { value: "workouts", icon: Dumbbell, label: "Workouts" },
    { value: "progress", icon: LineChart, label: "Progress" },
    { value: "social", icon: Users, label: "Social" },
    { value: "ai", icon: Bot, label: "AI Assistant" },
    { value: "profile", icon: UserCircle, label: "Profile" },
    { value: "photos", icon: Camera, label: "Photos" },
    { value: "timer", icon: Clock, label: "Workout Timer" },
  ]

  return (
    <>
      <div
        className={cn(
          "flex-shrink-0 pb-12 transition-all duration-300 ease-in-out",
          isMobile
            ? `fixed inset-y-0 left-0 z-40 w-64 transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              } bg-background border-r`
            : "w-64 bg-background border-r",
          className
        )}
      >
        <ScrollArea className="h-full">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Menu
              </h2>
              <div className="space-y-1">
                {items.map((item) => (
                  <motion.div
                    key={item.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={activeTab === item.value ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab(item.value)
                        if (isMobile) toggleSidebar()
                      }}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}

