"use client";

import { useState } from "react";
import { Send, Phone, Video, Info, Image as ImageIcon } from "lucide-react";

interface Message {
    id: number;
    sender: 'me' | 'other';
    text: string;
    timestamp: string;
}

interface Conversation {
    id: number;
    name: string;
    avatar?: string; // Color or image url
    lastMessage: string;
    messages: Message[];
    isOnline?: boolean;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        name: "Mom",
        avatar: "bg-gray-400",
        lastMessage: "Good luck at the new job! ❤️",
        messages: [
            { id: 1, sender: 'other', text: "Hey sweetie! Heard you started at PhishNet today.", timestamp: "8:30 AM" },
            { id: 2, sender: 'me', text: "Yeah! Just got to my desk.", timestamp: "8:32 AM" },
            { id: 3, sender: 'other', text: "So proud of you! Be careful with those emails 😉", timestamp: "8:33 AM" },
            { id: 4, sender: 'other', text: "Good luck at the new job! ❤️", timestamp: "8:33 AM" },
        ]
    },
    {
        id: 2,
        name: "Unknown Number",
        avatar: "bg-slate-300",
        lastMessage: "Your package is waiting...",
        messages: [
            { id: 1, sender: 'other', text: "USPS: We tried to deliver your waybill. Click here: http://bit.ly/scam", timestamp: "Yesterday" },
        ]
    },
    {
        id: 3,
        name: "Sarah (HR)",
        avatar: "bg-pink-400",
        lastMessage: "Lunch at 12?",
        messages: [
            { id: 1, sender: 'me', text: "Hey Sarah, when is the orientation?", timestamp: "9:00 AM" },
            { id: 2, sender: 'other', text: "It's at 2 PM. Btw, lunch at 12?", timestamp: "9:05 AM" },
        ]
    }
];

export default function MessagesApp() {
    const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
    const [activeConvId, setActiveConvId] = useState<number | null>(1);
    const [inputText, setInputText] = useState("");

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
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessage: inputText
                };
            }
            return c;
        }));

        setInputText("");
    };

    return (
        <div className="flex h-full bg-white font-sans text-sm">
            {/* Sidebar (Details List) */}
            <div className="w-1/3 min-w-[200px] border-r border-[#d1d1d6] bg-[#f5f5f7]/90 backdrop-blur-xl flex flex-col">
                {/* Header */}
                <div className="h-12 flex items-center justify-between px-4 border-b border-[#d1d1d6]">
                    <span className="font-semibold text-gray-500">Edit</span>
                    <ImageIcon className="text-blue-500 w-5 h-5 opacity-0" /> {/* Placeholder for center alignment */}
                    <span className="text-blue-500 text-xl"><ImageIcon className="w-5 h-5" /></span>
                </div>

                {/* Search */}
                <div className="p-2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[#e3e3e8] rounded-md px-3 py-1 text-sm outline-none placeholder-gray-500"
                    />
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={`flex items-start p-3 space-x-3 cursor-pointer ${activeConvId === conv.id ? 'bg-[#007aff] text-white' : 'hover:bg-gray-100 text-black'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${activeConvId === conv.id ? 'bg-white text-[#007aff]' : conv.avatar}`}>
                                {conv.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`font-semibold truncate ${activeConvId === conv.id ? 'text-white' : 'text-black'}`}>
                                        {conv.name}
                                    </h3>
                                    <span className={`text-xs ${activeConvId === conv.id ? 'text-white/80' : 'text-gray-500'}`}>
                                        {conv.messages[conv.messages.length - 1].timestamp}
                                    </span>
                                </div>
                                <p className={`text-xs truncate ${activeConvId === conv.id ? 'text-white/90' : 'text-gray-500'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
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
                                <span className="text-[10px] text-gray-500">iMessage</span>
                            </div>
                            <div className="absolute right-4 flex space-x-4">
                                <Video className="w-6 h-6 text-blue-500" />
                                <Info className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                            <div className="text-center text-xs text-gray-400 my-4">
                                iMessage with {activeConversation.name}
                            </div>
                            {activeConversation.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-tight relative
                                        ${msg.sender === 'me'
                                                ? 'bg-[#007aff] text-white rounded-br-none'
                                                : 'bg-[#e9e9eb] text-black rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
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
                                <button
                                    onClick={handleSend}
                                    className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${inputText.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'}`}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a conversation
                    </div>
                )}
            </div>
        </div>
    );
}
