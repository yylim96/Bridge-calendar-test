import { GoogleGenAI, Type } from "@google/genai";

export const parseEventWithAI = async (prompt: string) => {
  /**
   * Safe environment check. 
   * In many browser/ESM environments, 'process' is not globally defined.
   * We check the type of process first to avoid a ReferenceError.
   */
  let apiKey: string | undefined;
  
  try {
    if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Bridge: Environment access failed, falling back to window check.");
  }

  if (!apiKey) {
    console.error("Bridge AI: API_KEY is not defined. Ensure it is set in your environment variables.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: Current time is ${new Date().toISOString()}.
      Action: Extract calendar details from the user prompt into JSON.
      Prompt: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            start_time: { type: Type.STRING, description: "ISO 8601" },
            end_time: { type: Type.STRING, description: "ISO 8601" },
            is_shared: { type: Type.BOOLEAN },
            description: { type: Type.STRING },
          },
          required: ["title", "start_time", "end_time", "is_shared"]
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Bridge AI Sync Error:", e);
    return null;
  }
};