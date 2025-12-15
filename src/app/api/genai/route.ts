import { NextResponse } from "next/server";
import { generateEmailScenario, generateSMSScenario, generateFeedback, chatWithGuardian } from "@/lib/ai";

export async function POST(req: Request) {
    const body = await req.json();
    const { type, difficulty, scenario, userDecision, history, context, seed } = body;

    try {
        let result;

        switch (type) {
            case 'email':
                result = await generateEmailScenario(difficulty, seed);
                break;
            case 'sms':
                result = await generateSMSScenario(difficulty, seed);
                break;
            case 'feedback':
                result = await generateFeedback(scenario, userDecision);
                break;
            case 'chat':
                result = await chatWithGuardian(history, context);
                break;
            default:
                return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("AI Router Error:", error);
        return NextResponse.json({ error: "AI Processing Failed" }, { status: 500 });
    }
}
