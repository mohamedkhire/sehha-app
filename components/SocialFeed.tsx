import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  date: string;
  likes: number;
  comments: string[];
}

interface UserData {
  id: string;
  name: string;
}

interface SocialFeedProps {
  posts: SocialPost[]
  onNewPost: (post: Omit<SocialPost, 'id' | 'likes' | 'comments'>) => void
  currentUser: UserData
}

export function SocialFeed({ posts = [], onNewPost, currentUser }: SocialFeedProps) {
  const [newPost, setNewPost] = useState('')

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      onNewPost({
        userId: currentUser.id,
        userName: currentUser.name,
        content: newPost,
        date: new Date().toISOString(),
      })
      setNewPost('')
    }
  }

  const handleLike = (postId: string) => {
    // In a real app, you would update the likes on the server
    console.log(`Liked post: ${postId}`)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Social Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="mb-2"
              />
              <Button onClick={handlePostSubmit}>Post</Button>
            </CardContent>
          </Card>
          <ScrollArea className="h-[600px]">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-4">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.userId}`} />
                          <AvatarFallback>{post.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{post.userName}</p>
                            <span className="text-xs text-muted-foreground">{new Date(post.date).toLocaleString()}</span>
                          </div>
                          <p className="text-sm">{post.content}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                              👍 {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm">💬 {post.comments.length}</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

