import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatSessionConfig } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Current active chat session instance
let chatSession: Chat | null = null;

export const initializeChat = (config: ChatSessionConfig) => {
  const today = new Date().toLocaleDateString("en-US", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  chatSession = ai.chats.create({
    model: config.model,
    config: {
      systemInstruction: config.systemInstruction || `You are UCCAI, a helpful, intelligent, and precise AI assistant. 
You are an expert in coding, general knowledge, and academic subjects.
Current Date: ${today}.

ACADEMIC & SCHOLARLY DEFINITIONS:
When the user asks for a definition, explanation, or nature of a subject/concept (e.g., "What is Economics?", "Define Law"):
1. You MUST provide definitions from renowned scholars, authorities, or seminal works in that field.
   - Example: If asked "What is Economics?", you should cite Lionel Robbins ("Economics is the science which studies human behaviour as a relationship between ends and scarce means which have alternative uses") or Alfred Marshall.
2. Explicitly name the scholar, philosopher, or source.
3. Provide the formal definition first, then follow up with a simplified explanation if necessary.
4. Ensure your responses reflect current world updates and dates where applicable.`,
    },
    history: config.history,
  });
};

export const sendMessageStream = async function* (message: string): AsyncGenerator<string, void, unknown> {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};