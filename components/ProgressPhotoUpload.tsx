import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addProgressPhoto } from '../store/actions'
import { awardPoints } from '../utils/pointsSystem'

export function ProgressPhotoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const dispatch = useDispatch()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const photoData = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          imageUrl: reader.result as string
        }
        dispatch(addProgressPhoto(photoData))
        awardPoints(dispatch, 'photo_upload', 0)
        setSelectedFile(null)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Progress Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="photo-upload">Select a photo</Label>
          <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <Button onClick={handleUpload} disabled={!selectedFile}>Upload Photo</Button>
      </CardContent>
    </Card>
  )
}

