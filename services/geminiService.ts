import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Scenario, ScenarioType, Difficulty, ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Scenario Generation ---

const scenarioSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, enum: [ScenarioType.EMAIL, ScenarioType.SMS, ScenarioType.WHATSAPP] },
    sender: { type: Type.STRING, description: "Name of the sender" },
    senderAddress: { type: Type.STRING, description: "Email address or phone number. Make it tricky if phishing." },
    subject: { type: Type.STRING, description: "Subject line (empty for SMS)" },
    body: { type: Type.STRING, description: "The content of the message" },
    attachment: { type: Type.STRING, description: "Filename of attachment if any", nullable: true },
    isPhishing: { type: Type.BOOLEAN },
    redFlags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of specific indicators why this is phishing (or empty if safe)"
    },
    safeFactors: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of reasons why this looks legitimate"
    },
    explanation: { type: Type.STRING, description: "Detailed educational explanation of the scenario." }
  },
  required: ["type", "sender", "senderAddress", "body", "isPhishing", "redFlags", "explanation"],
};

export const generateScenario = async (difficulty: Difficulty, currentElo: number): Promise<Scenario> => {
  const modelId = "gemini-2.5-flash"; // Fast model for scenarios
  
  const prompt = `
    Generate a unique cybersecurity social engineering scenario for a user with ELO ${currentElo} (Difficulty: ${difficulty}).
    The scenario should be either an Email, SMS, or WhatsApp message.
    
    If Difficulty is NOVICE: Make phishing attempts obvious (typos, urgent demands, weird domains).
    If Difficulty is INTERMEDIATE: Use better grammar, urgency, maybe a spoofed brand.
    If Difficulty is EXPERT: Spear-phishing style. Contextual, no typos, sophisticated domain spoofing, psychological manipulation.
    
    Randomly decide if it is a Safe message or a Phishing attempt (approx 60% chance of phishing).
    Ensure the content is realistic and educational.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scenarioSchema,
        temperature: 0.8, // High creativity for varied scenarios
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      ...data,
      id: crypto.randomUUID(),
      difficulty,
    };
  } catch (error) {
    console.error("Gemini Scenario Gen Error:", error);
    // Fallback scenario in case of API failure
    return {
      id: "fallback",
      type: ScenarioType.EMAIL,
      sender: "IT Support",
      senderAddress: "support@company-update-security.com",
      subject: "Urgent: Password Expiry",
      body: "Your password expires in 2 hours. Click here to reset immediately.",
      isPhishing: true,
      redFlags: ["Urgency", "Suspicious Domain", "Generic Greeting"],
      safeFactors: [],
      difficulty: Difficulty.NOVICE,
      explanation: "This is a classic phishing attempt using urgency and a look-alike domain."
    };
  }
};

// --- Digital Guardian (Chat) ---

export const getGuardianResponse = async (
  history: ChatMessage[], 
  currentScenario: Scenario
): Promise<string> => {
  const modelId = "gemini-2.5-flash";
  
  // Convert history to Gemini format (simplification for this demo)
  // We strictly use the last few messages to keep context window clean
  const recentHistory = history.slice(-5).map(msg => `${msg.role}: ${msg.text}`).join('\n');

  const context = `
    Current Scenario Context:
    Type: ${currentScenario.type}
    Sender: ${currentScenario.sender} (${currentScenario.senderAddress})
    Body: ${currentScenario.body}
    Is Phishing: ${currentScenario.isPhishing}
  `;

  const systemInstruction = `
    You are the "Digital Guardian", an elite cybersecurity AI assistant from the PhishNet platform.
    Your goal is to help the user determine if the current scenario is safe or a threat.
    
    RULES:
    1. DO NOT explicitly tell the user "This is phishing" or "This is safe".
    2. DO guide them. Ask Socratic questions. E.g., "Have you checked the sender's domain carefully?" or "Does the tone seem unusually urgent?"
    3. Be concise, professional, but encouraging. A "Matrix" or "Cyberpunk" persona is acceptable but keep it subtle.
    4. If the user asks general security concepts, explain them clearly.
  `;

  const prompt = `
    ${context}
    
    Chat History:
    ${recentHistory}
    
    User's latest input is the last message in history. Provide the model response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I am currently recalibrating my sensors. Please verify the sender manually.";
  } catch (error) {
    console.error("Digital Guardian Error:", error);
    return "Connection to Digital Guardian uplink failed. Proceed with caution.";
  }
};
