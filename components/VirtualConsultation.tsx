import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { bookConsultation } from '../store/actions'
import { awardPoints } from '../utils/pointsSystem'

const mockExperts = [
  { id: '1', name: 'John Doe', specialty: 'Fitness Trainer' },
  { id: '2', name: 'Jane Smith', specialty: 'Nutritionist' },
  { id: '3', name: 'Mike Johnson', specialty: 'Physical Therapist' },
]

export function VirtualConsultation() {
  const [selectedExpert, setSelectedExpert] = useState<string | undefined>()
  const [consultationDate, setConsultationDate] = useState('')
  const [consultationTime, setConsultationTime] = useState('')
  const [consultationNotes, setConsultationNotes] = useState('')
  const dispatch = useDispatch()

  const handleBookConsultation = () => {
    if (selectedExpert && consultationDate && consultationTime) {
      const consultation = {
        id: Date.now().toString(),
        expertId: selectedExpert,
        expertName: mockExperts.find(e => e.id === selectedExpert)?.name || '',
        date: consultationDate,
        time: consultationTime,
        notes: consultationNotes,
      }
      dispatch(bookConsultation(consultation))
      awardPoints(dispatch, 'book_consultation', 0)
      setSelectedExpert(undefined)
      setConsultationDate('')
      setConsultationTime('')
      setConsultationNotes('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Consultation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedExpert}>
          <SelectTrigger>
            <SelectValue placeholder="Select an expert" />
          </SelectTrigger>
          <SelectContent>
            {mockExperts.map((expert) => (
              <SelectItem key={expert.id} value={expert.id}>
                {expert.name} - {expert.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={consultationDate}
          onChange={(e) => setConsultationDate(e.target.value)}
        />
        <Input
          type="time"
          value={consultationTime}
          onChange={(e) => setConsultationTime(e.target.value)}
        />
        <Textarea
          placeholder="Notes for the consultation..."
          value={consultationNotes}
          onChange={(e) => setConsultationNotes(e.target.value)}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!selectedExpert || !consultationDate || !consultationTime}>
              Book Consultation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to book this consultation?
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p>Expert: {mockExperts.find(e => e.id === selectedExpert)?.name}</p>
              <p>Date: {consultationDate}</p>
              <p>Time: {consultationTime}</p>
            </div>
            <Button onClick={handleBookConsultation}>Confirm Booking</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

