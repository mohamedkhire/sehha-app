import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface ProfileSetupProps {
  initialData: Partial<UserProfile>;
  onSubmit: (profile: FormData) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.number().min(13, {
    message: "You must be at least 13 years old.",
  }).max(120, {
    message: "Age must be less than 120.",
  }),
  height: z.number().min(50, {
    message: "Height must be at least 50 cm.",
  }).max(300, {
    message: "Height must be less than 300 cm.",
  }),
  weight: z.number().min(20, {
    message: "Weight must be at least 20 kg.",
  }).max(500, {
    message: "Weight must be less than 500 kg.",
  }),
  gender: z.string().min(1, {
    message: "Please select a gender.",
  }),
  activityLevel: z.string().min(1, {
    message: "Please select an activity level.",
  }),
  fitnessGoals: z.array(z.string()).min(1, {
    message: "Please select at least one fitness goal.",
  }),
  dietaryPreferences: z.array(z.string()),
  goalDate: z.string().min(1, {
    message: "Please select a goal date.",
  }),
  avatar: z.any().optional(),
})

export function ProfileSetup({ initialData, onSubmit }: ProfileSetupProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || '',
      age: initialData.age || undefined,
      height: initialData.height || undefined,
      weight: initialData.weight || undefined,
      gender: initialData.gender || undefined,
      activityLevel: initialData.activityLevel || undefined,
      fitnessGoals: initialData.fitnessGoals || [],
      dietaryPreferences: initialData.dietaryPreferences || [],
      goalDate: initialData.goalDate || undefined,
      avatar: initialData.avatar || undefined,
    },
  })

  function onSubmitForm(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'avatar' && value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    // Convert FormData to a plain object
    const profileData: Partial<UserProfile> = {};
    formData.forEach((value, key) => {
      if (key === 'avatar' && value instanceof File) {
        profileData[key] = URL.createObjectURL(value);
      } else {
        profileData[key] = value;
      }
    });

    onSubmit(profileData);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? '' : parseInt(value, 10));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : parseInt(value, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="lightly-active">Lightly Active</SelectItem>
                        <SelectItem value="moderately-active">Moderately Active</SelectItem>
                        <SelectItem value="very-active">Very Active</SelectItem>
                        <SelectItem value="extra-active">Extra Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fitnessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goals</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-4">
                      {['lose weight', 'gain muscle', 'improve endurance', 'increase flexibility'].map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={`goal-${goal}`}
                            checked={field.value.includes(goal)}
                            onCheckedChange={(checked) => {
                              const updatedGoals = checked
                                ? [...field.value, goal]
                                : field.value.filter((g) => g !== goal);
                              field.onChange(updatedGoals);
                            }}
                          />
                          <label htmlFor={`goal-${goal}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {goal}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-4">
                      {['vegan', 'vegetarian', 'keto', 'paleo', 'no restrictions'].map((diet) => (
                        <div key={diet} className="flex items-center space-x-2">
                          <Checkbox
                            id={`diet-${diet}`}
                            checked={field.value.includes(diet)}
                            onCheckedChange={(checked) => {
                              const updatedDiets = checked
                                ? [...field.value, diet]
                                : field.value.filter((d) => d !== diet);
                              field.onChange(updatedDiets);
                            }}
                          />
                          <label htmlFor={`diet-${diet}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {diet}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="goalDate">Goal Reach Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="avatar">Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            field.onChange(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </FormControl>
                  {field.value && typeof field.value === 'string' && (
                    <img src={field.value} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover" />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Complete Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

