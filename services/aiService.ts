
import { GoogleGenAI, Type } from "@google/genai";

export const parseEventWithAI = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following user request into a structured calendar event. 
    Current time is ${new Date().toISOString()}.
    Request: "${prompt}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          start_time: { type: Type.STRING, description: "ISO 8601 format" },
          end_time: { type: Type.STRING, description: "ISO 8601 format" },
          is_shared: { type: Type.BOOLEAN },
          description: { type: Type.STRING },
        },
        required: ["title", "start_time", "end_time", "is_shared"]
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};
