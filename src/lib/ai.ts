import Groq from "groq-sdk";
import { retrieveContext } from "@/data/knowledgeBase";

// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL_ID = "llama-3.3-70b-versatile";

// Helper: Parse JSON from Llama output (which can be chatty)
function parseJSON(text: string) {
    try {
        // Attempt to find JSON bloack
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return null;
    }
}

// --- 1. EMAIL GENERATOR (GROQ) ---
export async function generateEmailScenario(difficulty: string = "Novice", seed: string = "") {
    // Determine if this should be a safe or phishing email (50/50 chance)
    const isPhishing = Math.random() < 0.5;

    const prompt = `
    Generate a UNIQUE and REALISTIC corporate or personal email scenario for an INDIAN context.
    Type: ${isPhishing ? "PHISHING/SCAM" : "LEGITIMATE/SAFE"}.
    Difficulty: ${difficulty}.
    Random Topic: ${seed}.
    
    Topics (Pick one):
    - Income Tax Refund (ITD) vs Real Assessment Order
    - Bank KYC Update vs Real Transaction Alert
    - Amazon/Flipkart Order vs Real Delivery Update
    - Workplace: Bonus/Appraisal vs Real Meeting Invite
    - Subscriptions: Netflix/Spotify Payment Failed vs Real Invoice
    - Traffic Challan (Parivahan) vs Real Payment Receipt

    CONTEXT: 
    - If LEGITIMATE: Use correct grammar, valid domains (e.g., @hdfcbank.com, @amazon.in), no sense of artificial urgency, professional tone.
    - If PHISHING: Use subtle errors (e.g., @hdfc-kyc-update.com), panic-inducing language, generic greetings, suspicious links.

    Return ONLY raw JSON:
    {
      "sender": "Name or Org",
      "senderEmail": "email@address",
      "subject": "Subject Line",
      "body": "Detailed email body with specific Indian context (INR, dates, local terms)...",
      "isPhishing": ${isPhishing},
      "difficulty": "${difficulty}",
      "explanation": "Educational tip explaining why this is ${isPhishing ? 'FAKE' : 'REAL'} (e.g. 'Real banks never ask for OTPs on email' or 'Sender domain matches official website')."
    }
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL_ID,
            temperature: 0.8,
            max_tokens: 600,
        });

        const text = completion.choices[0]?.message?.content || "{}";
        const data = parseJSON(text);

        if (!data) throw new Error("Failed to parse JSON");
        return data;

    } catch (e) {
        console.error("Groq Email Error:", e);
        const fallback = {
            sender: "IT Dept",
            senderEmail: "admin@incometax-gov.in.fraud",
            subject: "Urgent: Tax Refund Failed",
            body: "Your tax refund of ₹45,000 has failed. Click to verify.",
            isPhishing: true,
            difficulty: "Novice",
            explanation: "The sender domain is fake (.fraud) and creates false urgency."
        };
        return fallback;
    }
}

// --- 2. SMS GENERATOR (GROQ) ---
export async function generateSMSScenario(difficulty: string = "Novice", seed: string = "") {
    // Determine Safe or Phishing
    const isPhishing = Math.random() < 0.6; // 60% Phishing, 40% Safe

    const prompt = `
    Generate a UNIQUE SMS scenario for an INDIAN user.
    Type: ${isPhishing ? "SMISHING (SCAM)" : "LEGITIMATE (SAFE)"}.
    Random Topic: ${seed}.
    
    Scenarios:
    - UPI (PhonePe/GPay): Fake Cashback vs Real Payment Notification
    - Bank: Account Blocked vs Real Debit Alert
    - Services: Power Cutoff vs Real Bill Payment Receipt
    - Job: Fake 'Work from Home' vs Real Interview Call
    - Telecom: 5G KYC Update vs Real Data Usage Alert
    - E-Challan: Fake Fine Link vs Real Violation Settlement

    Return ONLY raw JSON:
    {
      "sender": "Short Code (e.g. VM-SBIUPS, AD-DOMINO) or Mobile Number",
      "message": "The SMS text (include fake links e.g. bit.ly for scams, or clean text for safe)",
      "isPhishing": ${isPhishing},
      "explanation": "Short educational reason why this is ${isPhishing ? 'unsafe' : 'safe'}."
    }
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL_ID,
            temperature: 0.9,
            max_tokens: 300,
        });

        const text = completion.choices[0]?.message?.content || "{}";
        const data = parseJSON(text);
        if (!data) throw new Error("Failed to parse JSON");
        return data;

    } catch (e) {
        console.error("Groq SMS Error:", e);
        return {
            sender: "AX-HDFCBK",
            message: "Dear Customer, PAN not linked. Account blocked. Click: http://hdfc-pan-update.com",
            isPhishing: true,
            explanation: "Banks never send threatening links via SMS to update PAN."
        };
    }
}

// --- 3. FEEDBACK ENGINE (GROQ) ---
export async function generateFeedback(scenario: any, userDecision: boolean) {
    // If the scenario already has a pre-generated explanation, use it to save latency
    if (scenario.explanation) {
        const correct = (scenario.isPhishing && userDecision) || (!scenario.isPhishing && !userDecision);
        if (correct) return `Correct! ${scenario.explanation}`;
        return `Incorrect. ${scenario.explanation}`;
    }

    const correct = (scenario.isPhishing && userDecision) || (!scenario.isPhishing && !userDecision);

    const prompt = `
    Context: Indian Cybersecurity Training.
    Scenario: ${scenario.subject || scenario.message} (Is Phishing: ${scenario.isPhishing}).
    User Action: ${userDecision ? "Reported as Phishing" : "Marked as Safe"} (${correct ? "Correct" : "Incorrect"}).
    
    Task: Explain WHY in 1-2 simple sentences. 
    Focus on the specific cues (sender, link, urgency, grammar). 
    If Safe: Explain what makes it look authentic (regular patterns, no links).
    If Phishing: Point out the red flag.
    Start with: "${correct ? 'Well done!' : 'Oops!'}"
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL_ID,
            temperature: 0.7,
            max_tokens: 150,
        });
        return completion.choices[0]?.message?.content;
    } catch (e) {
        return correct ? "Good call. Always check the sender." : "Be careful, that looked suspicious.";
    }
}

// --- 4. GUARDIAN CHAT (RAG + GROQ) ---
export async function chatWithGuardian(history: any[], currentContext: string) {
    const userQuery = history[history.length - 1]?.text || "";
    const ragContext = retrieveContext(userQuery);

    const systemPrompt = `
    You are 'Jarvis', the Digital Guardian for PhishNet.
    Goal: Teach cybersecurity using the Socratic method.
    Context: ${currentContext}
    Knowledge Base: ${ragContext}
    
    Keep it short, professional, and slightly futuristic/cool.
  `;

    const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...history.map(h => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text }))
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: MODEL_ID,
            temperature: 0.7,
            max_tokens: 300,
        });
        return completion.choices[0]?.message?.content || "System recalibrating.";
    } catch (e) {
        return "Connection unstable.";
    }
}
