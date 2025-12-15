export const KNOWLEDGE_BASE = [
    {
        id: "phishing_indicators",
        content: "Common Phishing Red Flags: 1. Urgency (e.g., 'Act now or account locked'). 2. Mismatched Domains (e.g., 'netflix-support.com' instead of 'netflix.com'). 3. Generic Greetings (e.g., 'Dear Customer'). 4. Suspicious Attachments (e.g., .exe, .scr). 5. Spelling/Grammar mistakes."
    },
    {
        id: "email_analysis",
        content: "How to analyze email headers: Check the 'Return-Path' and 'Reply-To' fields. These often reveal the true sender. Spear-phishing targets specific individuals using public info (LinkedIn)."
    },
    {
        id: "url_safety",
        content: "URL Inspection: Hover over links without clicking. Look for 'typosquatting' (e.g., 'g0ogle.com'). Use tools like VirusTotal to scan suspicious links involved in the game context."
    },
    {
        id: "password_security",
        content: "Password Hygiene: Never share 2FA codes. IT support will NEVER ask for your password. Use a Password Manager."
    },
    {
        id: "social_engineering",
        content: "Social Engineering: Attackers manipulate emotions (Fear, Greed, Curiosity). Pretexting involves creating a fake scenario (e.g., 'I am the CEO stuck at the airport')."
    }
];

export function retrieveContext(query: string): string {
    // Simple keyword matching RAG
    const relevant = KNOWLEDGE_BASE.filter(item =>
        query.toLowerCase().includes("email") && item.id.includes("email") ||
        query.toLowerCase().includes("link") && item.id.includes("url") ||
        query.toLowerCase().includes("password") && item.id.includes("password") ||
        true // Fallback: Return General Phishing Indicators if no specific match
    );

    // Return top 2 chunks to avoid context overflow, prioritizing specific matches
    return relevant.slice(0, 3).map(i => i.content).join("\n\n");
}
