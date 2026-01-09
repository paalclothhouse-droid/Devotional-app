import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI strictly using process.env.API_KEY as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyHukamnama = async () => {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }); // Format: DD/MM/YYYY
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Fetch the official Daily Hukamnama of today (${today}) specifically as released by Sri Darbar Sahib (Golden Temple), Amritsar. 
      The response must include:
      1. The original Gurmukhi text.
      2. The English translation.
      3. The source (Ang number from Sri Guru Granth Sahib Ji).
      4. The date.
      
      Return the data strictly in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The original Gurmukhi text" },
            translation: { type: Type.STRING, description: "The English translation" },
            source: { type: Type.STRING, description: "The Ang reference" },
            date: { type: Type.STRING, description: "The date of the Hukamnama" }
          },
          required: ["text", "translation", "source", "date"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Failed to fetch Hukamnama:", error);
    // Fallback to a universal Gurbani verse if API fails
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
      contents: `You are a wise and compassionate spiritual advisor in the Sikh tradition. Provide a meaningful, religious answer to: ${query}.`,
    });
    return response.text;
  } catch (error) {
    return "The path is within. Keep focused on your meditation and the Guru's words.";
  }
};