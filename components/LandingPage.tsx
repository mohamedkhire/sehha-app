import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthPage } from './AuthPage'

interface LandingPageProps {
  onLogin: (username: string) => void
  onSignup: (username: string) => void
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary/20 to-secondary/20">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-foreground">Sehha App</span>
            </div>
            <div>
              <Button variant="outline">
                Login
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-foreground">
              <h1 className="text-4xl font-bold mb-4">Transform Your Life with Our Sehha App</h1>
              <p className="text-xl mb-6">Track your progress, get personalized plans, and achieve your fitness goals.</p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Now
              </Button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <img src="/placeholder.svg?height=300&width=400" alt="App Preview" className="rounded-lg shadow-lg" />
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Weight Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Personalized plans for weight loss, gain, or maintenance based on your BMI.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fitness Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Monitor your workouts, set goals, and track your progress over time.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Get personalized advice and answers to your health and fitness questions.</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
            <AuthPage onLogin={onLogin} onSignup={onSignup} />
          </div>
        </div>
      </main>
    </div>
  )
}

