import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIChatProps {
  userData: UserData
}

export function AIChat({ userData }: AIChatProps) {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<{ user: string; ai: string }[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState('')

  const predefinedQuestions = [
    { q: 'How can I improve my diet?', a: 'To improve your diet, focus on eating a variety of whole foods, including fruits, vegetables, lean proteins, and whole grains. Limit processed foods and sugary drinks. Also, pay attention to portion sizes and try to eat mindfully.' },
    { q: 'What are some good exercises for beginners?', a: 'For beginners, start with low-impact exercises like walking, swimming, or cycling. Bodyweight exercises such as push-ups, squats, and lunges are also great. Consider yoga or Pilates for flexibility and core strength. Remember to start slowly and gradually increase intensity.' },
    { q: 'How much sleep do I need?', a: 'Most adults need between 7 to 9 hours of sleep per night. However, individual needs may vary. Consistent sleep patterns, a relaxing bedtime routine, and a comfortable sleep environment can help improve sleep quality.' },
    { q: 'How can I stay motivated with my fitness goals?', a: 'Set realistic, achievable goals and track your progress. Celebrate small victories along the way. Find activities you enjoy and mix up your routine to avoid boredom. Consider working out with a friend or joining a fitness class for added accountability and social support.' },
    { q: 'What should I eat before and after a workout?', a: 'Before a workout, eat a light meal rich in carbohydrates and some protein about 2-3 hours prior. After a workout, consume a meal with both carbohydrates and protein within 45 minutes to aid recovery and muscle growth. Stay hydrated before, during, and after exercise.' },
  ]

  const handleSendMessage = () => {
    if (message.trim() === '') return

    const aiResponse = getAIResponse(message)

    setChatHistory(prev => [...prev, { user: message, ai: aiResponse }])
    setMessage('')
  }

  const getAIResponse = (userMessage: string) => {
    const responses = [
      "That's a great question! Based on your health goals, I'd recommend focusing on balanced nutrition and regular exercise.",
      "Remember, consistency is key. Keep up with your daily goals and you'll see progress!",
      "It's important to listen to your body. Make sure you're getting enough rest and staying hydrated.",
      "Great job on your recent achievements! Keep challenging yourself and you'll continue to improve.",
      "Consider trying new activities to keep your fitness routine exciting and engaging.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSelectQuestion = (question: string) => {
    setSelectedQuestion(question)
    const selectedPredefinedQuestion = predefinedQuestions.find(q => q.q === question)
    if (selectedPredefinedQuestion) {
      setChatHistory(prev => [...prev, { user: question, ai: selectedPredefinedQuestion.a }])
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Health Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">You: {chat.user}</p>
              <p className="bg-muted p-2 rounded-lg mt-1">AI: {chat.ai}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-2 mb-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a health-related question..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
        <div>
          <Select onValueChange={handleSelectQuestion}>
            <SelectTrigger>
              <SelectValue placeholder="Select a question" />
            </SelectTrigger>
            <SelectContent>
              {predefinedQuestions.map((q, index) => (
                <SelectItem key={index} value={q.q}>{q.q}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

