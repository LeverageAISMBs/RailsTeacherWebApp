import { GoogleGenAI, Content, Part, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { CLICommandResponse } from "../types";

// We check for window.aistudio for the specific Veo/Image models.
// We remove the conflicting global declaration to avoid TS errors about subsequent property declarations.
// Instead we cast window to any where needed.

const apiKey = process.env.API_KEY || '';

// Singleton instance management
let aiClient: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!aiClient) {
    if (!apiKey) {
      console.error("API Key is missing. Ensure process.env.API_KEY is set.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

// Helper to handle the "Paid Key Selection" for high-end models if we were in a supported environment
const ensurePaidKeySelection = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
        const aistudio = (window as any).aistudio;
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await aistudio.openSelectKey();
        }
    }
}

export const sendMessageToTutor = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const ai = getAIClient();
    const recentHistory = history.slice(-10); 
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, 
        maxOutputTokens: 2000,
      }
    });

    const response = await chat.sendMessage({
      message: message
    });

    return response.text || "I processed that, but produced no text output.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System Alert: Unable to contact the AI Architect. Please verify your API connection.";
  }
};

export const generateArchitecturalReview = async (userCode: string): Promise<string> => {
    const ai = getAIClient();
    const prompt = `Review the following Rails code for structural integrity, security, and adherence to Rails 7+ patterns:\n\n${userCode}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    });

    return response.text || "Analysis complete (no output).";
}

export const generateConceptSlide = async (concept: string): Promise<string | null> => {
    try {
        await ensurePaidKeySelection();
        
        // We re-instantiate here to pick up the key if openSelectKey was used (per instructions)
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Create a high-fidelity architectural slide diagram explaining: ${concept}. 
        Style: Dark background, technical blueprint aesthetics, neon cyan and magenta accents, highly schematic. 
        Focus on structure and data flow.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview', // High quality model
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                    imageSize: "1K"
                }
            }
        });

        // Extract image from response parts
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("NanoBanana Visualization Error:", error);
        return null;
    }
}

export const generateRailsCLICommand = async (naturalLanguageInput: string): Promise<CLICommandResponse | null> => {
    const ai = getAIClient();
    
    const schema = {
        type: Type.OBJECT,
        properties: {
          command: {
            type: Type.STRING,
            description: "The exact 'rails generate' command to execute.",
          },
          explanation: {
            type: Type.STRING,
            description: "Brief explanation of why these flags or types were chosen.",
          },
          flags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of flags used (e.g., --skip-test, --no-timestamps).",
          },
        },
        required: ["command", "explanation"],
    };

    const prompt = `Translate the following natural language request into a precise Rails 7/8 CLI command. 
    Request: "${naturalLanguageInput}"
    
    Rules:
    - Prefer 'rails generate' or 'rails g'.
    - Use correct field types (e.g., 'rich_text' instead of text if implied).
    - If user asks for auth, suggest 'rails g authentication' (Rails 8) or relevant scaffold.
    - Be precise with syntax (e.g., 'user:references' for associations).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const text = response.text;
        if (text) {
            return JSON.parse(text) as CLICommandResponse;
        }
        return null;
    } catch (error) {
        console.error("CLI Architect Error:", error);
        return null;
    }
}