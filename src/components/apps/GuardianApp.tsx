"use client";
import { useState } from "react";
import { Send, ShieldCheck, Bot, Search, FileText, Globe } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";

import ReactMarkdown from 'react-markdown';
import { useRef, useEffect } from "react";

export default function GuardianApp() {
    const [input, setInput] = useState("");
    const [chat, setChat] = useState<{ role: string, text: string }[]>([
        { role: 'ai', text: "Namaste! I am your **Digital Guardian**.  \nI can help you analyze threats using my knowledge of headers, URLs, and social engineering.  \n\n*What do you want to check today?*" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentObjective = useGameStore(s => s.currentObjective);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat, loading]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;
        const newHistory = [...chat, { role: 'user', text: text }];
        setChat(newHistory);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch('/api/genai', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'chat',
                    history: newHistory,
                    context: `Current Objective: ${currentObjective}`
                })
            });
            const reply = await res.json();
            setChat([...newHistory, { role: 'ai', text: reply }]);
        } catch (e) {
            setChat([...newHistory, { role: 'ai', text: "System Offline. Connection interrupted." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-900/30 flex items-center justify-center border border-green-500/20">
                        <ShieldCheck className="text-green-400" size={18} />
                    </div>
                    <div>
                        <span className="font-bold block leading-tight text-sm tracking-wide">DIGITAL GUARDIAN</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] text-green-400/80 font-mono tracking-wider">SYSTEM ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
                {chat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 text-sm shadow-md ${msg.role === 'user'
                                ? 'bg-blue-600/90 text-white rounded-2xl rounded-tr-sm'
                                : 'bg-slate-800/80 text-gray-100 rounded-2xl rounded-tl-sm border border-white/5'
                            }`}>
                            {msg.role === 'ai' && (
                                <div className="flex items-center gap-2 mb-2 text-green-400 text-[10px] font-bold uppercase tracking-wider opacity-80 border-b border-white/5 pb-1">
                                    <Bot size={12} /> Jarvis AI
                                </div>
                            )}
                            <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800/50 p-3 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-green-500/50 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-green-500/50 rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-green-500/50 rounded-full animate-bounce delay-300"></div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">Decryption in progress...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-slate-900/50 border-t border-white/5 no-scrollbar">
                {[
                    { icon: FileText, label: "Analyze Headers", prompt: "How do I analyze email headers for spoofing?", color: "text-blue-400" },
                    { icon: Globe, label: "Check URL", prompt: "How to spot a fake URL or domain?", color: "text-purple-400" },
                    { icon: Search, label: "Social Eng.", prompt: "What are common social engineering tactics used in India?", color: "text-orange-400" }
                ].map((action, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(action.prompt)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition-all hover:scale-105 border border-white/5 whitespace-nowrap group"
                    >
                        <action.icon size={14} className={`${action.color} group-hover:brightness-125`} />
                        <span className="text-gray-300 group-hover:text-white">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/90 border-t border-white/5 backdrop-blur-sm">
                <div className="relative flex items-center">
                    <input
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-white outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-sm placeholder-slate-500 transition-all font-medium"
                        placeholder="Ask for cybersecurity guidance..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                        disabled={loading}
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 p-2 bg-green-600 rounded-lg hover:bg-green-500 text-white disabled:opacity-50 disabled:hover:bg-green-600 transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
