export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MEAL_PLANNER = 'MEAL_PLANNER',
  FRIDGE_CHEF = 'FRIDGE_CHEF',
  CHAT_COACH = 'CHAT_COACH',
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
}

export interface DailyPlan {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snack: Recipe;
  totalCalories: number;
  dietaryType: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface FridgeAnalysis {
  ingredientsDetected: string[];
  suggestedRecipes: Recipe[];
}

export interface UserPreferences {
  diet: string;
  calories: number;
  allergies: string;
}