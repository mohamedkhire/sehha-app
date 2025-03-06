'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface AuthPageProps {
  onLogin: (username: string) => void
  onSignup: (username: string) => void
}

export function AuthPage({ onLogin, onSignup }: AuthPageProps) {
  const [username, setUsername] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNewUser) {
      onSignup(username)
    } else {
      onLogin(username)
    }
  }

  return (
    <Card className="w-[350px] mx-auto mt-20">
      <CardHeader>
        <CardTitle>{isNewUser ? 'Create Account' : 'Login'}</CardTitle>
        <CardDescription>
          {isNewUser ? 'Sign up for a new account' : 'Login to your existing account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleSubmit}>
          {isNewUser ? 'Sign Up' : 'Login'}
        </Button>
        <Button
          variant="link"
          className="w-full"
          onClick={() => setIsNewUser(!isNewUser)}
        >
          {isNewUser ? 'Already have an account? Login' : 'New user? Create an account'}
        </Button>
      </CardFooter>
    </Card>
  )
}

