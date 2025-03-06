import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from 'framer-motion'
import { RootState } from '../store'
import { addProgressPhoto } from '../store/actions'

interface ProgressPhoto {
  id: string
  date: string
  imageUrl: string
}

// interface ProgressPhotoComparisonProps {
//   userData: UserProfile
// }

export function ProgressPhotoComparison() {
  const [selectedBefore, setSelectedBefore] = useState<string | undefined>()
  const [selectedAfter, setSelectedAfter] = useState<string | undefined>()
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const { toast } = useToast()
  const dispatch = useDispatch()
  const progressPhotos = useSelector((state: RootState) => state.progress.photos || [])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewPhoto(event.target.files[0])
    }
  }

  const handleSavePhoto = () => {
    if (newPhoto) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newProgressPhoto = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          imageUrl: reader.result as string
        }
        dispatch(addProgressPhoto(newProgressPhoto))
        toast({
          title: "Photo Uploaded",
          description: "Your progress photo has been saved.",
        })
        setNewPhoto(null)
      }
      reader.readAsDataURL(newPhoto)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progress Photo Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="before-photo">Before Photo</Label>
            <Select onValueChange={setSelectedBefore} value={selectedBefore}>
              <SelectTrigger id="before-photo">
                <SelectValue placeholder="Select 'Before' photo" />
              </SelectTrigger>
              <SelectContent>
                {progressPhotos.map((photo) => (
                  <SelectItem key={photo.id} value={photo.id}>
                    {new Date(photo.date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBefore && (
              <motion.img 
                src={progressPhotos.find(p => p.id === selectedBefore)?.imageUrl} 
                alt="Before" 
                className="mt-2 w-full h-auto rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
          <div>
            <Label htmlFor="after-photo">After Photo</Label>
            <Select onValueChange={setSelectedAfter} value={selectedAfter}>
              <SelectTrigger id="after-photo">
                <SelectValue placeholder="Select 'After' photo" />
              </SelectTrigger>
              <SelectContent>
                {progressPhotos.map((photo) => (
                  <SelectItem key={photo.id} value={photo.id}>
                    {new Date(photo.date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAfter && (
              <motion.img 
                src={progressPhotos.find(p => p.id === selectedAfter)?.imageUrl} 
                alt="After" 
                className="mt-2 w-full h-auto rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-photo">Upload New Progress Photo</Label>
          <div className="flex items-center space-x-4">
            <Input 
              id="new-photo" 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload}
              aria-describedby="new-photo-description"
            />
            {newPhoto && (
              <Button variant="outline" onClick={() => setNewPhoto(null)}>
                Remove
              </Button>
            )}
          </div>
          <p id="new-photo-description" className="text-sm text-muted-foreground mt-1">
            You can upload a new photo at any time to track your progress.
          </p>
          <Button onClick={handleSavePhoto} disabled={!newPhoto}>Save New Progress Photo</Button>
        </div>
      </CardContent>
    </Card>
  )
}

