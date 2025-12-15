"use client";

import { useState, useEffect } from "react";
import { Send, Video, Info, Image as ImageIcon, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";

// Types
interface Message {
    id: number;
    sender: 'me' | 'other';
    text: string;
    timestamp: string;
}

interface Conversation {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    messages: Message[];
    isPhishing?: boolean; // Track if this convo is a generated threat
    reported?: boolean;
}

const SMS_TOPICS = ["UPI Cashback", "E-Challan", "Job Offer", "Bank Block", "Electricity Bill", "Friend in trouble", "5G Update"];

export default function MessagesApp() {
    const { incrementScore, setCurrentObjective } = useGameStore();
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: 1,
            name: "Domino's India",
            avatar: "bg-blue-600",
            lastMessage: "50% Off on your next Pizza order!",
            messages: [
                { id: 1, sender: 'other', text: "Weekend treat! 50% Off on your next Pizza order! Use code PIZZA50. Order now: http://dominos.co.in", timestamp: "Fri" },
            ]
        },
        {
            id: 2,
            name: "Mummy",
            avatar: "bg-gray-400",
            lastMessage: "Beta, did you eat?",
            messages: [
                { id: 1, sender: 'me', text: "Yes ma, working on the project.", timestamp: "8:00 AM" },
                { id: 2, sender: 'other', text: "Ok take care.", timestamp: "8:02 AM" }
            ]
        }
    ]);
    const [activeConvId, setActiveConvId] = useState<number>(1);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ msg: string, correct: boolean } | null>(null);

    const getRandomTopic = () => SMS_TOPICS[Math.floor(Math.random() * SMS_TOPICS.length)] + " " + Date.now();

    // AI Fetch Logic
    const fetchNewSmishing = async () => {
        // limit to 8 to avoid clutter
        if (conversations.length > 8) return;

        setLoading(true);
        try {
            const res = await fetch('/api/genai', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'sms',
                    difficulty: 'Intermediate',
                    seed: getRandomTopic()
                })
            });
            const data = await res.json();

            // Create a new conversation for the attack
            const newId = Date.now();
            const newConv: Conversation = {
                id: newId,
                name: data.sender || "Unknown",
                avatar: data.isPhishing ? "bg-red-500" : "bg-green-600",
                lastMessage: data.message,
                messages: [
                    { id: 1, sender: 'other', text: data.message || "Error generating text", timestamp: "Now" }
                ],
                isPhishing: data.isPhishing
            };

            setConversations(prev => [newConv, ...prev]);

            // Optional sounds or toast here
        } catch (e) {
            console.error("SMS Fetch Error", e);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch loop
    useEffect(() => {
        fetchNewSmishing();
        const interval = setInterval(fetchNewSmishing, 30000); // Every 30s
        return () => clearInterval(interval);
    }, []);

    const handleDecision = async (convo: Conversation, markedAsPhishing: boolean) => {
        setLoading(true);
        // Default to true if undefined, but our new backend sends strictly true/false
        const isActuallyPhishing = convo.isPhishing === true;

        const isCorrect = (markedAsPhishing && isActuallyPhishing) || (!markedAsPhishing && !isActuallyPhishing);

        // Call AI Feedback
        const res = await fetch('/api/genai', {
            method: 'POST',
            body: JSON.stringify({
                type: 'feedback',
                scenario: { message: convo.messages[0].text, isPhishing: isActuallyPhishing },
                userDecision: markedAsPhishing
            })
        });
        const explanation = await res.json();

        setFeedback({ msg: explanation, correct: isCorrect });

        if (isCorrect) {
            incrementScore(100);
            setCurrentObjective(markedAsPhishing ? "Smishing Blocked!" : "Safe Message Verified");
        } else {
            incrementScore(-20);
            setCurrentObjective("Review Security Principles.");
        }
        setLoading(false);
    };

    const activeConversation = conversations.find(c => c.id === activeConvId);

    const handleSend = () => {
        if (!inputText.trim() || !activeConvId) return;
        const newMessage: Message = {
            id: Date.now(),
            sender: 'me',
            text: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(c => {
            if (c.id === activeConvId) {
                return { ...c, messages: [...c.messages, newMessage], lastMessage: inputText };
            }
            return c;
        }));
        setInputText("");

        // If user replies to a bot, maybe trigger a generic bot rejection?
        if (activeConversation?.id && activeConversation.id > 100) {
            setTimeout(() => {
                setConversations(prev => prev.map(c => {
                    if (c.id === activeConvId) {
                        const botReply: Message = { id: Date.now(), sender: 'other', text: "Message not delivered: Number blocked or invalid.", timestamp: "Now" };
                        return { ...c, messages: [...c.messages, botReply] };
                    }
                    return c;
                }));
            }, 1000);
        }
    };

    const deleteConversation = (id: number) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvId === id) setActiveConvId(conversations[0]?.id || 0);
        setFeedback(null);
    };

    return (
        <div className="flex h-full bg-white font-sans text-sm relative">

            {/* Feedback Overlay */}
            {feedback && (
                <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in backdrop-blur-sm">
                    {feedback.correct ? <CheckCircle size={64} className="text-green-500 mb-4" /> : <XCircle size={64} className="text-orange-500 mb-4" />}
                    <h2 className="text-2xl font-bold mb-2 text-black">{feedback.correct ? "Great Job!" : "Careful!"}</h2>
                    <p className="text-lg text-gray-600 mb-6 max-w-md">{feedback.msg}</p>
                    <button onClick={() => {
                        // If correct, remove the convo as it's "dealt with"
                        if (feedback.correct && activeConvId) {
                            deleteConversation(activeConvId);
                        } else {
                            setFeedback(null); // Just close on wrong answer to let them try again or see
                        }
                    }} className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-blue-700 transition-all">
                        {feedback.correct ? "Next Message" : "Try Again"}
                    </button>
                </div>
            )}

            {/* Sidebar */}
            <div className="w-1/3 min-w-[200px] border-r border-[#d1d1d6] bg-[#f5f5f7]/90 backdrop-blur-xl flex flex-col">
                {/* Header */}
                <div className="h-12 flex items-center justify-between px-4 border-b border-[#d1d1d6]">
                    <span className="font-semibold text-blue-500 cursor-pointer hover:underline" onClick={fetchNewSmishing}>
                        {loading ? "..." : "Filters"}
                    </span>
                    <span className="font-bold text-black">Messages</span>
                    <ImageIcon className="text-blue-500 w-5 h-5 opacity-0" />
                </div>

                {/* Search */}
                <div className="p-2">
                    <input type="text" placeholder="Search" className="w-full bg-[#e3e3e8] rounded-md px-3 py-1 text-sm outline-none placeholder-gray-500" />
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div key={conv.id} onClick={() => setActiveConvId(conv.id)} className={`flex items-start p-3 space-x-3 cursor-pointer border-b border-gray-100 ${activeConvId === conv.id ? 'bg-[#007aff] text-white' : 'hover:bg-gray-100 text-black'}`}>
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${activeConvId === conv.id ? 'bg-white text-[#007aff]' : conv.avatar}`}>
                                {conv.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`font-semibold truncate ${activeConvId === conv.id ? 'text-white' : 'text-black'}`}>{conv.name}</h3>
                                    <span className={`text-xs ${activeConvId === conv.id ? 'text-white/80' : 'text-gray-500'}`}>{conv.messages[conv.messages.length - 1]?.timestamp}</span>
                                </div>
                                <p className={`text-xs truncate ${activeConvId === conv.id ? 'text-white/90' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                            </div>
                            {/* Blue dot for unread/new AI generated convos */}
                            {conv.id > 2000 && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="h-12 border-b border-[#d1d1d6] bg-[#f5f5f7]/90 backdrop-blur-xl flex items-center justify-between px-4 z-10">
                            <div className="flex flex-col items-center mx-auto">
                                <span className="font-semibold text-black text-sm">{activeConversation.name}</span>
                                <span className="text-[10px] text-gray-500">
                                    {activeConversation.id > 100 ? "Unknown Sender" : "Contact"}
                                </span>
                            </div>
                            <div className="absolute right-4 flex space-x-4 text-blue-500">
                                <Video className="w-6 h-6 opacity-50" />
                                <Info className="w-5 h-5 opacity-50" />
                            </div>
                        </div>

                        {/* Analysis / Report Banner (For generated messages) */}
                        {activeConversation.id > 100 && (
                            <div className="bg-gray-50 p-3 flex flex-col items-center border-b border-gray-200">
                                <span className="text-xs text-gray-500 mb-2">This sender is not in your contacts. Determine if it's safe.</span>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleDecision(activeConversation, false)}
                                        className="text-xs px-4 py-1.5 border border-green-600 text-green-700 rounded-full font-bold hover:bg-green-50 transition-colors"
                                    >
                                        Mark as Safe
                                    </button>
                                    <button
                                        onClick={() => handleDecision(activeConversation, true)}
                                        className="text-xs px-4 py-1.5 bg-red-100 text-red-600 border border-red-200 rounded-full font-bold hover:bg-red-200 transition-colors flex items-center gap-1"
                                    >
                                        Report Junk <AlertTriangle size={12} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                            <div className="text-center text-xs text-gray-400 my-4">iMessage with {activeConversation.name}</div>
                            {activeConversation.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-tight ${msg.sender === 'me' ? 'bg-[#007aff] text-white rounded-br-none' : 'bg-[#e9e9eb] text-black rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-[#f5f5f7] border-t border-[#d1d1d6] flex items-center space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="iMessage"
                                    className="w-full border border-[#d1d1d6] rounded-full pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                                />
                                <button onClick={handleSend} className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${inputText.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'}`}>
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Select a conversation</div>
                )}
            </div>
        </div>
    );
}
