import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const steps = [
  {
    title: "Welcome to Sehha App",
    content: "Let's get you started on your fitness journey!",
  },
  {
    title: "Set Your Goals",
    content: "Start by setting your fitness goals in the Profile section.",
  },
  {
    title: "Track Your Progress",
    content: "Use the Daily Progress feature to log your activities and meals.",
  },
  {
    title: "Join Challenges",
    content: "Participate in daily challenges to stay motivated and earn achievements.",
  },
  {
    title: "Get AI Assistance",
    content: "Use our AI Health Assistant for personalized advice and answers to your questions.",
  },
]

interface OnboardingGuideProps {
  onComplete: () => void;
}

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
  }

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{steps[currentStep].content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}

