/*
 * Project: Health-Fitness-app
 * Author: Mohamed Khire
 * Date: Jan 2025
 * Description: A health and fitness tracking app built with React and Next.js, designed to help users monitor their wellness journey.
 * GitHub: https://github.com/mohamedkhire
 * Live: https://sehha-app.vercel.app/
 */
import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface AIAssistantProps {
  userData: UserProfile;
  templates: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant({ userData, templates }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { role: 'user', content: input }])
      setInput('')
      setIsTyping(true)
      setTimeout(() => {
        const response = generateResponse(input)
        setMessages(prev => [...prev, { role: 'assistant', content: response }])
        setIsTyping(false)
      }, 1500) // Simulating AI response time
    }
  }

  const generateResponse = (query: string) => {
    // Simple response generation based on keywords and user data
    if (query.toLowerCase().includes('workout')) {
      return `Based on your profile, ${userData.name}, I recommend focusing on ${userData.fitnessGoals.includes('lose weight') ? 'cardio exercises' : 'strength training'} to help with your ${userData.fitnessGoals[0]} goal. Try activities like ${userData.activityLevel === 'sedentary' ? 'walking, swimming, or light jogging' : 'jogging, cycling, or high-intensity interval training'} for 30 minutes a day, 5 days a week.`
    } else if (query.toLowerCase().includes('diet') || query.toLowerCase().includes('nutrition')) {
      const dietType = userData.dietaryPreferences.includes('vegan') ? 'vegan' : 
                       userData.dietaryPreferences.includes('vegetarian') ? 'vegetarian' : 'balanced';
      return `As someone following a ${dietType} diet aiming to ${userData.fitnessGoals[0]}, focus on ${dietType === 'vegan' ? 'high-protein plant sources like lentils, chickpeas, and tofu' : dietType === 'vegetarian' ? 'a mix of plant proteins and eggs or dairy' : 'lean proteins like chicken, fish, and plant-based sources'}. Incorporate plenty of vegetables and whole grains, and limit processed foods.`
    } else {
      return `I'm here to help with your fitness journey, ${userData.name}. Feel free to ask about workouts, nutrition, or any other health-related topics!`
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <span>Sehha AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar>
                    <AvatarImage src={message.role === 'user' ? userData.avatar : '/ai-avatar.png'} />
                    <AvatarFallback>{message.role === 'user' ? <User /> : <Bot />}</AvatarFallback>
                  </Avatar>
                  <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2"
            >
              <Avatar>
                <AvatarImage src="/ai-avatar.png" />
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <Badge variant="secondary" className="animate-pulse">
                AI is typing...
              </Badge>
            </motion.div>
          )}
        </ScrollArea>
        <div className="space-y-2">
          <Select onValueChange={(value) => setInput(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a question template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template, index) => (
                <SelectItem key={index} value={template}>{template}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} className="shrink-0">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

