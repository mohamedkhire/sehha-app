/*
 * Project: Health-Fitness-app
 * Author: Mohamed Khire
 * Date: Jan 2025
 * Description: A health and fitness tracking app built with React and Next.js, designed to help users monitor their wellness journey.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://sehha-app.vercel.app/
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { AuthModal } from './AuthModal'
import { ProfileSetup } from './ProfileSetup'
import { Dashboard } from './Dashboard'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"
import { setUser, clearUser, updateUserProfile } from '../store/slices/userSlice'
import { OnboardingGuide } from './OnboardingGuide'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from './ErrorBoundary'
import { Sidebar } from "./Sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "./ModeToggle"
import { UserNav } from "./UserNav"
import { Toaster } from "@/components/ui/toaster"
import { setItem, getItem, removeItem } from '../utils/inMemoryStorage'
import { Menu } from 'lucide-react'

export function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const dispatch = useDispatch()
  const userData = useSelector((state: RootState) => state.user)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showHamburger, setShowHamburger] = useState(true)

  useEffect(() => {
    const storedUser = getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      dispatch(setUser(user))
      setIsAuthenticated(true)
      setNeedsProfileSetup(false)
    }
  }, [dispatch])

  const handleLogin = (username: string) => {
    const storedUsers = JSON.parse(getItem('users') || '[]')
    const user = storedUsers.find((u: any) => u.name === username)
    if (user) {
      setIsAuthenticated(true)
      setActiveTab("overview")
      dispatch(setUser(user))
      setNeedsProfileSetup(false)
      setItem('user', JSON.stringify(user))
      toast({
        title: "Login Successful",
        description: "Welcome back to Sehha app!",
      })
    } else {
      toast({
        title: "User Not Found",
        description: "Please sign up to create a new account.",
        variant: "destructive",
      })
    }
  }

  const handleSignup = (username: string) => {
    setIsAuthenticated(true)
    dispatch(setUser({ name: username } as any))
    setNeedsProfileSetup(true)
    setActiveTab("overview")
    toast({
      title: "Sign Up Successful",
      description: "Welcome to Sehha app! Let's set up your profile.",
    })
  }

  const handleProfileSetup = (profile: Partial<UserProfile>) => {
    const updatedProfile = { ...userData, ...profile, id: Date.now().toString() }
    dispatch(setUser(updatedProfile as UserProfile))
    setNeedsProfileSetup(false)
    setShowOnboarding(true)
    
    try {
      const storedUsers = JSON.parse(getItem('users') || '[]')
      storedUsers.push(updatedProfile)
      setItem('users', JSON.stringify(storedUsers))
      setItem('user', JSON.stringify(updatedProfile))
    } catch (error) {
      console.error('Error saving user data:', error)
      toast({
        title: "Storage Issue",
        description: "There was a problem saving your data. Some features may be limited.",
        variant: "destructive",
      })
    }

    toast({
      title: "Profile Completed",
      description: "Your profile has been set up successfully.",
    })
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    toast({
      title: "Onboarding Completed",
      description: "You're all set! Enjoy using Sehha app.",
    })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setNeedsProfileSetup(false)
    setShowOnboarding(false)
    dispatch(clearUser())
    removeItem('user')
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const handleDeleteProfile = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")
    if (confirmDelete) {
      const storedUsers = JSON.parse(getItem('users') || '[]')
      const updatedUsers = storedUsers.filter((user: any) => user.id !== userData.id)
      setItem('users', JSON.stringify(updatedUsers))
      removeItem('user')
      dispatch(clearUser())
      setIsAuthenticated(false)
      setNeedsProfileSetup(false)
      setShowOnboarding(false)
      toast({
        title: "Profile Deleted",
        description: "Your profile has been successfully deleted.",
      })
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (isSidebarOpen) {
      setIsSidebarOpen(false)
      setShowHamburger(true)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    if (!isSidebarOpen) {
      setShowHamburger(false)
    }
  }


  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {isAuthenticated && !needsProfileSetup && !showOnboarding && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 gap-4">
              {isAuthenticated && !needsProfileSetup && !showOnboarding && showHamburger && (
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-xl font-bold text-foreground">Sehha app</h1>
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle />
                {isAuthenticated ? (
                  <UserNav onLogout={handleLogout} onDeleteProfile={handleDeleteProfile} setActiveTab={handleTabChange} />
                ) : (
                  <AuthModal onLogin={handleLogin} onSignup={handleSignup} />
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <ScrollArea className="h-full w-full">
              <div className="container mx-auto py-6 px-4 md:px-6">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <AnimatePresence mode="wait">
                    {isAuthenticated ? (
                      needsProfileSetup ? (
                        <ProfileSetup initialData={userData} onSubmit={handleProfileSetup} />
                      ) : showOnboarding ? (
                        <OnboardingGuide onComplete={handleOnboardingComplete} />
                      ) : (
                        <Dashboard activeTab={activeTab} setActiveTab={handleTabChange} />
                      )
                    ) : (
                      <motion.div 
                        className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h2 className="text-3xl font-bold mb-4 text-center">Welcome to Sehha app</h2>
                        <p className="text-xl mb-8 text-muted-foreground text-center">Your journey to a healthier lifestyle starts here.</p>
                        <AuthModal onLogin={handleLogin} onSignup={handleSignup} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ErrorBoundary>
              </div>
            </ScrollArea>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div role="alert" className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
      <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong</h2>
      <p className="mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}

