import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, Difficulty, Question, Flashcard } from "../types";

// DIRECTLY access the variable so Vite's `define` plugin can replace the string `process.env.API_KEY`.
// @ts-ignore
const apiKey = process.env.API_KEY;

// Debug logging to help identify issues (visible in browser console F12)
console.log("Gemini API Status:", {
  exists: !!apiKey,
  length: apiKey ? apiKey.length : 0,
  isPlaceholder: apiKey === 'your_google_gemini_key_here' || apiKey === 'AIzaSy...Your_Actual_Key_Here'
});

// Initialize the API client
// We pass a dummy string if missing to prevent immediate crash, but validation will catch it later
const ai = new GoogleGenAI({ apiKey: apiKey || 'missing-key' });

export async function generateQuizFromText(
  text: string,
  topic: string,
  difficulty: Difficulty,
  count: number,
  flashcardCount: number
): Promise<Quiz> {
  
  // 1. Check if key exists
  if (!apiKey) {
    throw new Error("API Key is missing. Check your .env file or Netlify settings.");
  }

  // 2. Check if user forgot to replace the placeholder text
  if (apiKey === 'your_google_gemini_key_here' || apiKey.includes('Your_Actual_Key_Here')) {
    throw new Error("You are using the placeholder API Key. Please paste your real key from Google AI Studio.");
  }

  const modelId = 'gemini-3-flash-preview'; 

  const prompt = `
    Generate a ${difficulty} difficulty quiz about "${topic}".
    The quiz should have exactly ${count} questions.
    
    ALSO generate exactly ${flashcardCount} high-quality flashcards for key concepts defined in the text.
    
    Base everything on the following text content:
    "${text.slice(0, 15000)}" 
    
    If the text is empty or too short, use your general knowledge about the topic.
    Ensure strict JSON output.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "text", "options", "correctAnswerIndex", "explanation"]
              }
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  front: { type: Type.STRING, description: "The term or question on the front of the card" },
                  back: { type: Type.STRING, description: "The definition or answer on the back of the card" }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["quizTitle", "questions", "flashcards"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text);
    
    // Transform to our internal Quiz type
    const quiz: Quiz = {
      id: crypto.randomUUID(),
      title: data.quizTitle,
      topic: topic,
      questions: data.questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `q-${index}`,
        correctAnswerIndex: Number(q.correctAnswerIndex)
      })),
      flashcards: (data.flashcards || []).map((f: any, index: number) => ({
        ...f,
        id: f.id || `f-${index}`
      })),
      createdAt: Date.now()
    };

    return quiz;

  } catch (error: any) {
    console.error("Quiz generation failed:", error);
    // If it's a 400 error, it's usually the API key
    if (error.message?.includes('400') || error.status === 400) {
        throw new Error("Invalid API Key. Please check that you copied it correctly.");
    }
    throw error;
  }
}