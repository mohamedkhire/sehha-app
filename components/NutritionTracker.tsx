import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Utensils, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface NutritionEntry {
  id: string;
  userId: string; // Added userId
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: { name: string; calories: number; protein: number; carbs: number; fat: number }[];
}

interface NutritionTrackerProps {
  nutritionHistory: NutritionEntry[];
  onNutritionUpdate: (entry: NutritionEntry) => void;
}

const egyptianFoodDatabase = {
  breakfast: [
    { name: 'Ful Medames', calories: 200, protein: 13, carbs: 30, fat: 8, category: 'breakfast' as const, isEgyptian: true },
    { name: 'Ta\'meya (Falafel)', calories: 330, protein: 13, carbs: 31, fat: 18, category: 'breakfast' as const, isEgyptian: true },
    { name: 'Shakshuka', calories: 250, protein: 15, carbs: 20, fat: 15, category: 'breakfast' as const, isEgyptian: true },
    { name: 'Feteer Meshaltet', calories: 350, protein: 8, carbs: 45, fat: 18, category: 'breakfast' as const, isEgyptian: true },
    { name: 'Beid Bel Basterma', calories: 280, protein: 20, carbs: 2, fat: 22, category: 'breakfast' as const, isEgyptian: true },
  ],
  lunch: [
    { name: 'Koshari', calories: 350, protein: 10, carbs: 65, fat: 5, category: 'lunch' as const, isEgyptian: true },
    { name: 'Molokhia', calories: 150, protein: 5, carbs: 10, fat: 12, category: 'lunch' as const, isEgyptian: true },
    { name: 'Mahshi (Stuffed Grape Leaves)', calories: 35, protein: 1, carbs: 7, fat: 1, category: 'lunch' as const, isEgyptian: true },
    { name: 'Fattah', calories: 450, protein: 20, carbs: 50, fat: 22, category: 'lunch' as const, isEgyptian: true },
    { name: 'Hamam Mahshi', calories: 400, protein: 30, carbs: 20, fat: 25, category: 'lunch' as const, isEgyptian: true },
  ],
  dinner: [
    { name: 'Bamia', calories: 160, protein: 6, carbs: 15, fat: 10, category: 'dinner' as const, isEgyptian: true },
    { name: 'Shawarma', calories: 430, protein: 30, carbs: 35, fat: 20, category: 'dinner' as const, isEgyptian: true },
    { name: 'Macarona Bechamel', calories: 400, protein: 15, carbs: 50, fat: 18, category: 'dinner' as const, isEgyptian: true },
    { name: 'Fatta', calories: 380, protein: 18, carbs: 45, fat: 16, category: 'dinner' as const, isEgyptian: true },
    { name: 'Kebda Eskandarani', calories: 250, protein: 25, carbs: 10, fat: 15, category: 'dinner' as const, isEgyptian: true },
  ],
  snack: [
    { name: 'Umm Ali', calories: 370, protein: 8, carbs: 45, fat: 20, category: 'snack' as const, isEgyptian: true },
    { name: 'Baklava', calories: 250, protein: 4, carbs: 30, fat: 15, category: 'snack' as const, isEgyptian: true },
    { name: 'Dates', calories: 100, protein: 1, carbs: 25, fat: 0, category: 'snack' as const, isEgyptian: true },
    { name: 'سندوتش بطاطس السوري (Syrian Potato Sandwich)', calories: 300, protein: 5, carbs: 40, fat: 15, category: 'snack' as const, isEgyptian: true },
    { name: 'Termes (Lupini Beans)', calories: 120, protein: 10, carbs: 15, fat: 3, category: 'snack' as const, isEgyptian: true },
    { name: 'Balah El Sham', calories: 220, protein: 3, carbs: 35, fat: 10, category: 'snack' as const, isEgyptian: true },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function NutritionTracker({ nutritionHistory, onNutritionUpdate }: NutritionTrackerProps) {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFood, setSelectedFood] = useState('');
  const [customFood, setCustomFood] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [dailyGoal, setDailyGoal] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 65 });
  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let foodItem;
    if (selectedFood === 'custom') {
      foodItem = { ...customFood, category: mealType, isEgyptian: false };
    } else {
      foodItem = egyptianFoodDatabase[mealType].find(f => f.name === selectedFood);
    }
    
    if (foodItem) {
      const newEntry: NutritionEntry = {
        id: Date.now().toString(),
        userId: '1', // Replace with actual user ID
        date: new Date().toISOString(),
        mealType,
        foodItems: [foodItem],
      };
      onNutritionUpdate(newEntry);
      setSelectedFood('');
      setCustomFood({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
      setIsAddFoodDialogOpen(false);
    }
  };

  const calculateDailyTotals = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = nutritionHistory.filter(entry => entry.date.startsWith(today));
    return todayEntries.reduce((totals, entry) => {
      entry.foodItems.forEach(item => {
        totals.calories += item.calories;
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
      });
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const dailyTotals = calculateDailyTotals();

  const macroData = [
    { name: 'Protein', value: dailyTotals.protein },
    { name: 'Carbs', value: dailyTotals.carbs },
    { name: 'Fat', value: dailyTotals.fat },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Nutrition Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="log">Log Food</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Daily Nutrition Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Calories</Label>
                      <Progress value={(dailyTotals.calories / dailyGoal.calories) * 100} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {dailyTotals.calories} / {dailyGoal.calories} kcal
                      </p>
                    </div>
                    <div>
                      <Label>Protein</Label>
                      <Progress value={(dailyTotals.protein / dailyGoal.protein) * 100} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {dailyTotals.protein} / {dailyGoal.protein} g
                      </p>
                    </div>
                    <div>
                      <Label>Carbs</Label>
                      <Progress value={(dailyTotals.carbs / dailyGoal.carbs) * 100} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {dailyTotals.carbs} / {dailyGoal.carbs} g
                      </p>
                    </div>
                    <div>
                      <Label>Fat</Label>
                      <Progress value={(dailyTotals.fat / dailyGoal.fat) * 100} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {dailyTotals.fat} / {dailyGoal.fat} g
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Macronutrient Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="log">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Dialog open={isAddFoodDialogOpen} onOpenChange={setIsAddFoodDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setIsAddFoodDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Food
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Food</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mealType">Meal Type</Label>
                      <Select onValueChange={(value: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
                        setMealType(value);
                        setSelectedFood('');
                      }} value={mealType}>
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foodName">Food Name</Label>
                      <Select onValueChange={setSelectedFood} value={selectedFood}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select food" />
                        </SelectTrigger>
                        <SelectContent>
                          {egyptianFoodDatabase[mealType].map((food) => (
                            <SelectItem key={food.name} value={food.name}>{food.name}</SelectItem>
                          ))}
                          <SelectItem value="custom">Custom Food</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedFood === 'custom' && (
                      <div className="space-y-2">
                        <Label htmlFor="customFoodName">Custom Food Name</Label>
                        <Input 
                          id="customFoodName" 
                          value={customFood.name} 
                          onChange={(e) => setCustomFood({...customFood, name: e.target.value})} 
                          required 
                        />
                        <Label htmlFor="customCalories">Calories</Label>
                        <Input 
                          id="customCalories" 
                          type="number" 
                          value={customFood.calories} 
                          onChange={(e) => setCustomFood({...customFood, calories: Number(e.target.value)})} 
                          required 
                        />
                        <Label htmlFor="customProtein">Protein (g)</Label>
                        <Input 
                          id="customProtein" 
                          type="number" 
                          value={customFood.protein} 
                          onChange={(e) => setCustomFood({...customFood, protein: Number(e.target.value)})} 
                          required 
                        />
                        <Label htmlFor="customCarbs">Carbs (g)</Label>
                        <Input 
                          id="customCarbs" 
                          type="number" 
                          value={customFood.carbs} 
                          onChange={(e) => setCustomFood({...customFood, carbs: Number(e.target.value)})} 
                          required 
                        />
                        <Label htmlFor="customFat">Fat (g)</Label>
                        <Input 
                          id="customFat" 
                          type="number" 
                          value={customFood.fat} 
                          onChange={(e) => setCustomFood({...customFood, fat: Number(e.target.value)})} 
                          required 
                        />
                      </div>
                    )}
                    <Button type="submit" className="w-full">Add Food</Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddFoodDialogOpen(false)} className="mt-2 w-full">
                      Cancel
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>
          </TabsContent>
          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ScrollArea className="h-[400px]">
                <AnimatePresence>
                  {nutritionHistory.slice(-10).reverse().map((entry) => (
                    <motion.div 
                      key={entry.id} 
                      className="mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                            <Badge variant="outline">{entry.mealType}</Badge>
                          </div>
                          <ul className="list-disc list-inside pl-4">
                            {entry.foodItems.map((item, index) => (
                              <li key={index} className="text-sm">
                                {item.name} - {item.calories} calories, {item.protein}g protein, {item.carbs}g carbs, {item.fat}g fat
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

