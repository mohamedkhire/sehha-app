import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addNutritionEntry } from '../store/actions'
import { awardPoints } from '../utils/pointsSystem'

const mockRecipes = [
  { id: 1, name: "Grilled Chicken Salad", calories: 350, protein: 30, carbs: 15, fat: 20 },
  { id: 2, name: "Vegetarian Stir Fry", calories: 300, protein: 15, carbs: 40, fat: 10 },
  { id: 3, name: "Salmon with Roasted Vegetables", calories: 400, protein: 35, carbs: 20, fat: 25 },
  { id: 4, name: "Quinoa Bowl with Avocado", calories: 450, protein: 20, carbs: 60, fat: 20 },
]

export function MealPlanner() {
  const [selectedMeal, setSelectedMeal] = useState<string | undefined>()
  const [selectedRecipe, setSelectedRecipe] = useState<typeof mockRecipes[0] | null>(null)
  const dispatch = useDispatch()

  const handleAddMeal = () => {
    if (selectedRecipe) {
      const nutritionEntry: NutritionEntry = {
        id: Date.now().toString(),
        userId: '1', // Replace with actual user ID
        date: new Date().toISOString(),
        mealType: selectedMeal as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        foodItems: [{
          name: selectedRecipe.name,
          calories: selectedRecipe.calories,
          protein: selectedRecipe.protein,
          carbs: selectedRecipe.carbs,
          fat: selectedRecipe.fat,
          category: selectedMeal as 'breakfast' | 'lunch' | 'dinner' | 'snack',
          isEgyptian: false,
        }]
      }
      dispatch(addNutritionEntry(nutritionEntry))
      awardPoints(dispatch, 'meal_planning', 0)
      setSelectedRecipe(null)
      setSelectedMeal(undefined)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Planner</CardTitle>
      </CardHeader>
      <CardContent classNameCardContent className="space-y-4">
        <Select onValueChange={setSelectedMeal}>
          <SelectTrigger>
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!selectedMeal}>Choose Recipe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose a Recipe</DialogTitle>
              <DialogDescription>Select a recipe for your {selectedMeal}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              {mockRecipes.map((recipe) => (
                <Button
                  key={recipe.id}
                  variant="outline"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  {recipe.name} - {recipe.calories} cal
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        {selectedRecipe && (
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-semibold mb-2">{selectedRecipe.name}</h3>
            <p>Calories: {selectedRecipe.calories}</p>
            <p>Protein: {selectedRecipe.protein}g</p>
            <p>Carbs: {selectedRecipe.carbs}g</p>
            <p>Fat: {selectedRecipe.fat}g</p>
          </div>
        )}
        <Button onClick={handleAddMeal} disabled={!selectedRecipe}>
          Add to Meal Plan
        </Button>
      </CardContent>
    </Card>
  )
}

