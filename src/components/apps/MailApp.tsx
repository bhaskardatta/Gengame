"use client";

import { Mail, RefreshCw, AlertTriangle, Trash2, Reply, CheckCircle, XCircle } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { useState, useEffect } from "react";

// Email Interface
interface Email {
    id: number;
    sender: string;
    senderEmail: string;
    subject: string;
    body: string;
    isPhishing: boolean;
    difficulty: string;
    read?: boolean;
}

const TOPICS = ["Income Tax", "Job Offer", "Lottery", "Bank KYC", "Amazon Delivery", "Netflix", "Traffic Fine", "Diwali Bonus"];

export default function MailApp() {
    const { incrementScore, setCurrentObjective, score } = useGameStore();
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ msg: string, correct: boolean } | null>(null);

    const getDifficulty = () => {
        if (score > 1500) return "Expert";
        if (score > 500) return "Intermediate";
        return "Novice";
    };

    const getRandomTopic = () => TOPICS[Math.floor(Math.random() * TOPICS.length)] + " " + Date.now();

    const fetchNewEmail = async () => {
        // limit emails to 10 to prevent memory issues
        if (emails.length > 10) return;

        setLoading(true);
        try {
            const res = await fetch('/api/genai', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'email',
                    difficulty: getDifficulty(),
                    seed: getRandomTopic()
                })
            });
            const data = await res.json();
            const newEmail = { ...data, id: Date.now(), read: false };
            setEmails(prev => [newEmail, ...prev]);

            // Notify user of new mail (you could add sound here)
            if (emails.length === 0) setSelectedEmail(newEmail);

        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // Auto-Fetch Loop - Every 25 seconds
    useEffect(() => {
        fetchNewEmail();
        const interval = setInterval(fetchNewEmail, 25000);
        return () => clearInterval(interval);
    }, []);

    const handleDecision = async (markedAsPhishing: boolean) => {
        if (!selectedEmail) return;
        setLoading(true);

        const isCorrect = (markedAsPhishing && selectedEmail.isPhishing) || (!markedAsPhishing && !selectedEmail.isPhishing);

        // If we have a pre-generated explanation, we can display it locally OR we can ask AI to refine it based on user choice.
        // For better interactivity, let's hit the feedback endpoint which uses our new logic.
        const res = await fetch('/api/genai', {
            method: 'POST',
            body: JSON.stringify({
                type: 'feedback',
                scenario: selectedEmail,
                userDecision: markedAsPhishing
            })
        });
        const explanation = await res.json();

        setFeedback({ msg: explanation, correct: isCorrect });

        if (isCorrect) {
            incrementScore(100);
            setCurrentObjective(markedAsPhishing ? "Threat Neutralized!" : "Safe Email Verified!");
        } else {
            incrementScore(-50);
            setCurrentObjective("Security Breach Detected!");
        }
        setLoading(false);
    };

    const handleNext = () => {
        if (selectedEmail) {
            setEmails(prev => prev.filter(e => e.id !== selectedEmail.id));
            setSelectedEmail(null);
        }
        setFeedback(null);
    };

    return (
        <div className="flex h-full bg-white text-slate-800 font-sans relative">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                    <button onClick={fetchNewEmail} className="w-full bg-blue-600 text-white py-2 rounded flex justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
                        {loading ? <RefreshCw className="animate-spin" size={16} /> : "Check for Mail"}
                    </button>
                    <div className="text-xs text-center text-gray-500 mt-2">Auto-syncing every 25s...</div>
                </div>
                <div className="overflow-y-auto flex-1">
                    {emails.map(e => (
                        <div key={e.id} onClick={() => { setSelectedEmail(e); setFeedback(null); }} className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors ${selectedEmail?.id === e.id ? 'bg-blue-100 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}>
                            <div className="font-bold truncate text-slate-900">{e.sender}</div>
                            <div className="text-sm truncate text-slate-600">{e.subject}</div>
                            {/* Educational Badge */}
                            {!e.read && <div className="mt-1 inline-block w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                    ))}
                    {emails.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">No new emails. Waiting for server...</div>
                    )}
                </div>
            </div>

            {/* Reading Pane */}
            <div className="flex-1 flex flex-col bg-slate-50 relative">
                {selectedEmail ? (
                    <>
                        {/* Feedback Overlay */}
                        {feedback && (
                            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in backdrop-blur-sm">
                                {feedback.correct ? <CheckCircle size={64} className="text-green-500 mb-4" /> : <XCircle size={64} className="text-red-500 mb-4" />}
                                <h2 className="text-2xl font-bold mb-2 text-slate-900">{feedback.correct ? "Excellent Analysis!" : "Security Failure"}</h2>
                                <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">{feedback.msg}</p>
                                <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                                    Continue &rarr;
                                </button>
                            </div>
                        )}

                        <div className="p-8 flex-1 overflow-auto bg-white m-6 rounded-lg shadow-sm border border-slate-200">
                            <h1 className="text-2xl font-bold mb-6 text-slate-900">{selectedEmail.subject}</h1>
                            <div className="flex items-center gap-3 mb-8 border-b pb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xl">{selectedEmail.sender[0]}</div>
                                <div>
                                    <div className="font-bold text-lg text-slate-900">{selectedEmail.sender}</div>
                                    <div className="text-slate-500 text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">&lt;{selectedEmail.senderEmail}&gt;</div>
                                </div>
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-base">{selectedEmail.body}</div>
                        </div>
                        <div className="p-6 bg-white border-t flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <div className="flex-1 flex items-center text-xs text-gray-400 italic">
                                Analyze the sender domain and content carefully.
                            </div>
                            <button onClick={() => handleDecision(false)} disabled={loading} className="px-6 py-2 border-2 border-green-600 text-green-700 rounded hover:bg-green-50 font-bold transition-colors">
                                Mark as Safe
                            </button>
                            <button onClick={() => handleDecision(true)} disabled={loading} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold flex items-center gap-2 shadow-md transition-colors">
                                <AlertTriangle size={18} /> Report Phishing
                            </button>
                        </div>
                    </>
                ) : <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <Mail size={48} className="mb-4 opacity-50" />
                    <p>Select an email to inspect its security headers.</p>
                </div>}
            </div>
        </div>
    );
}
