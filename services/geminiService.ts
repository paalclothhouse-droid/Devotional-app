
import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI strictly using process.env.API_KEY as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyHukamnama = async () => {
  const today = new Date().toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Fetch the official Daily Hukamnama from Sri Darbar Sahib (Golden Temple) for today's date (${today}). 
      Provide the Gurmukhi text, the English translation, the Ang number, and the Manglacharan if present. 
      Return the data strictly in the requested JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The original Gurmukhi text of the Hukamnama" },
            translation: { type: Type.STRING, description: "The English translation" },
            source: { type: Type.STRING, description: "The Ang number and scripture reference" },
            date: { type: Type.STRING, description: "The date of the Hukamnama" }
          },
          required: ["text", "translation", "source", "date"]
        }
      }
    });
    // The response.text property returns the generated text directly.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Failed to fetch Hukamnama:", error);
    return {
      text: "ਹੁਕਮੀ ਹੋਵਨਿ ਆਕਾਰ ਹੁਕਮੁ ਨ ਕਹਿਆ ਜਾਈ ॥",
      translation: "By His Command, bodies are created; His Command cannot be described.",
      source: "Ang 1, Sri Guru Granth Sahib Ji",
      date: today
    };
  }
};

export const getSpiritualReflection = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a wise and compassionate spiritual advisor. Provide a meaningful, religious answer to: ${query}.`,
    });
    // Correctly accessing the text property.
    return response.text;
  } catch (error) {
    return "The path is within. Keep focused on your meditation.";
  }
};
