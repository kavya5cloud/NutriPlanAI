import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyPlan, Recipe, FridgeAnalysis } from "../types";
import { MODEL_NAME, VISION_MODEL_NAME } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

// Schema for Recipe
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    calories: { type: Type.INTEGER },
    protein: { type: Type.STRING, description: "e.g. 20g" },
    carbs: { type: Type.STRING, description: "e.g. 30g" },
    fat: { type: Type.STRING, description: "e.g. 10g" },
    prepTime: { type: Type.STRING, description: "e.g. 15 mins" },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["name", "calories", "ingredients", "instructions", "prepTime", "protein", "carbs", "fat"]
};

// Schema for Daily Meal Plan
const mealPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    breakfast: recipeSchema,
    lunch: recipeSchema,
    dinner: recipeSchema,
    snack: recipeSchema,
    totalCalories: { type: Type.INTEGER },
    dietaryType: { type: Type.STRING }
  },
  required: ["breakfast", "lunch", "dinner", "snack", "totalCalories", "dietaryType"]
};

// Schema for Fridge Analysis
const fridgeAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ingredientsDetected: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of ingredients identified in the image"
    },
    suggestedRecipes: {
      type: Type.ARRAY,
      items: recipeSchema,
      description: "3 suggested recipes based on ingredients"
    }
  },
  required: ["ingredientsDetected", "suggestedRecipes"]
};

export const generateDailyMealPlan = async (
  diet: string,
  calories: number,
  allergies: string
): Promise<DailyPlan | null> => {
  try {
    const ai = getClient();
    const prompt = `Generate a 1-day meal plan (Breakfast, Lunch, Dinner, Snack) for a "${diet}" diet targeting approx ${calories} calories. 
    ${allergies ? `Avoid these allergens: ${allergies}.` : ''} 
    Ensure recipes are practical and healthy.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealPlanSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyPlan;
    }
    return null;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};

export const analyzeFridgeImage = async (base64Image: string): Promise<FridgeAnalysis | null> => {
  try {
    const ai = getClient();
    const prompt = "Identify the ingredients in this image and suggest 3 healthy recipes I can make with them (assuming basic pantry staples like oil, salt, pepper).";

    const response = await ai.models.generateContent({
      model: VISION_MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: fridgeAnalysisSchema,
        temperature: 0.5
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FridgeAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Error analyzing fridge:", error);
    throw error;
  }
};

export const chatWithCoach = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const ai = getClient();
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: history,
      config: {
        systemInstruction: "You are a supportive, knowledgeable nutrition coach. Keep answers concise, motivating, and scientifically accurate. Format with markdown if needed.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I encountered an error connecting to the nutrition database.";
  }
};

export const getIngredientSubstitutions = async (
  ingredient: string,
  recipeContext: string,
  diet?: string,
  allergies?: string
): Promise<string[]> => {
  try {
    const ai = getClient();
    const prompt = `Suggest 3 simple substitutes for "${ingredient}" in a recipe for "${recipeContext}".
    ${diet ? `Diet context: ${diet}.` : ''}
    ${allergies ? `Must strictly avoid these allergens: ${allergies}.` : ''}
    Return ONLY a JSON array of strings, e.g. ["Almond Milk", "Oat Milk", "Soy Milk"]. If no good substitutes exist, return an empty array.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as string[];
    }
    return [];
  } catch (error) {
    console.error("Error getting substitutions:", error);
    return [];
  }
};
