"use client";

import { Mail, Star, Send, Trash, AlertOctagon, Pen, Search, ArrowLeft } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { useTaskStore } from "@/stores/taskStore";
import { useState } from "react";

interface Email {
    id: number;
    sender: string;
    senderEmail: string;
    subject: string;
    snippet: string;
    body: string;
    time: string;
    read: boolean;
    starred: boolean;
    isPhishing: boolean;
}

const INITIAL_EMAILS: Email[] = [
    {
        id: 1,
        sender: "IT Support",
        senderEmail: "support@phishnet-corp.internal",
        subject: "Action Required: Password Expiry Imminent",
        snippet: "Your corporate network password is set to expire...",
        body: "Dear Employee,\n\nYour corporate network password is set to expire in less than 2 hours.\nTo continue accessing network resources, please update your password immediately using the link below:\n\n[UPDATE PASSWORD NOW]\n\nPhishNet Corp IT Security Team",
        time: "10:42 AM",
        read: false,
        starred: false,
        isPhishing: true
    },
    {
        id: 2,
        sender: "HR Department",
        senderEmail: "hr@phishnet-corp.internal",
        subject: "New Vacation Policy Update",
        snippet: "Please review the attached document regarding changes...",
        body: "Hi Team,\n\nWe have updated our annual leave policy effective next month. Please check the intranet for more details.\n\nBest,\nHuman Resources",
        time: "9:15 AM",
        read: true,
        starred: true,
        isPhishing: false
    },
    {
        id: 3,
        sender: "CEO Office",
        senderEmail: "ceo-urgent@gmail.com",
        subject: "Urgent Wire Transfer Needed",
        snippet: "I am in a meeting and can't talk. Process this...",
        body: "I need you to process a vendor payment immediately. I am stuck in a board meeting and cannot access the portal. Please wire $5,000 to the account attached.\n\nSent from my iPhone",
        time: "Yesterday",
        read: false,
        starred: false,
        isPhishing: true
    }
];

export default function MailApp() {
    const { incrementScore, setCurrentObjective } = useGameStore();
    const { completeTask } = useTaskStore();
    const [emails, setEmails] = useState(INITIAL_EMAILS);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [filter, setFilter] = useState<'inbox' | 'starred' | 'sent'>('inbox');

    const handleReportPhishing = (email: Email) => {
        if (email.isPhishing) {
            incrementScore(100);
            completeTask('day1-01'); // Assuming general daily task ID or specific logic
            setCurrentObjective("Threat neutralized! Checking for more...",);
            alert("THREAT NEUTRALIZED! +100 Reputation\nGood eye! That was definitely a phishing attempt.");
            // Mark as handled or remove
            setEmails(prev => prev.filter(e => e.id !== email.id));
            setSelectedEmail(null);
        } else {
            incrementScore(-20);
            alert("FALSE ALARM! -20 Reputation\nThat was a legitimate email from HR.");
        }
    };

    const toggleStar = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setEmails(prev => prev.map(email =>
            email.id === id ? { ...email, starred: !email.starred } : email
        ));
    };

    const openEmail = (email: Email) => {
        setSelectedEmail(email);
        setEmails(prev => prev.map(e =>
            e.id === email.id ? { ...e, read: true } : e
        ));
    };

    const filteredEmails = emails.filter(e => {
        if (filter === 'starred') return e.starred;
        // Simple mock for sent
        if (filter === 'sent') return false;
        return true;
    });

    return (
        <div className="flex h-full bg-white font-sans text-sm">
            {/* Sidebar */}
            <div className="w-60 bg-white border-r border-gray-200 flex flex-col py-4 pr-2">
                <div className="pl-4 mb-4">
                    <button className="flex items-center gap-3 bg-[#c2e7ff] hover:shadow-md text-[#001d35] px-6 py-4 rounded-2xl font-semibold transition-all">
                        <Pen size={18} />
                        <span>Compose</span>
                    </button>
                </div>

                <div className="space-y-1">
                    <div
                        onClick={() => { setFilter('inbox'); setSelectedEmail(null); }}
                        className={`flex items-center gap-4 px-6 py-1.5 rounded-r-full cursor-pointer ${filter === 'inbox' ? 'bg-[#d3e3fd] text-[#001d35] font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <Mail size={18} />
                        <span>Inbox</span>
                        <span className="ml-auto text-xs font-semibold">{emails.filter(e => !e.read).length || ''}</span>
                    </div>
                    <div
                        onClick={() => { setFilter('starred'); setSelectedEmail(null); }}
                        className={`flex items-center gap-4 px-6 py-1.5 rounded-r-full cursor-pointer ${filter === 'starred' ? 'bg-[#d3e3fd] text-[#001d35] font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <Star size={18} />
                        <span>Starred</span>
                    </div>
                    <div
                        onClick={() => { setFilter('sent'); setSelectedEmail(null); }}
                        className={`flex items-center gap-4 px-6 py-1.5 rounded-r-full cursor-pointer ${filter === 'sent' ? 'bg-[#d3e3fd] text-[#001d35] font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <Send size={18} />
                        <span>Sent</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white rounded-tl-2xl overflow-hidden mt-2 mr-2 mb-2 border border-gray-100 shadow-sm relative">
                {/* Header (Search Bar placeholder) */}
                <div className="h-14 border-b border-gray-200 flex items-center px-4 gap-4 bg-[#f6f8fc]">
                    <div className="flex-1 max-w-2xl bg-[#eaf1fb] px-4 py-2 rounded-full flex items-center gap-3 text-gray-600">
                        <Search size={20} />
                        <input type="text" placeholder="Search mail" className="bg-transparent outline-none w-full" />
                    </div>
                </div>

                {selectedEmail ? (
                    // Email Read View
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <button onClick={() => setSelectedEmail(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div className="flex gap-2">
                                <button title="Report Phishing" onClick={() => handleReportPhishing(selectedEmail)} className="p-2 hover:bg-red-50 text-red-600 rounded-full flex gap-2 items-center px-4 bg-red-50 border border-red-100">
                                    <AlertOctagon size={18} />
                                    <span className="text-xs font-bold">Report Phishing</span>
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 max-w-4xl">
                            <h1 className="text-2xl font-normal text-gray-900 mb-6">{selectedEmail.subject}</h1>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                    {selectedEmail.sender[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-bold text-gray-900">{selectedEmail.sender}</span>
                                        <span className="text-xs text-gray-500">{selectedEmail.time}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                {selectedEmail.body}
                            </div>

                            {/* Mock Actions */}
                            <div className="mt-8 flex gap-2">
                                <button className="border border-gray-300 px-6 py-2 rounded-full text-gray-600 hover:bg-gray-50 font-medium">Reply</button>
                                <button className="border border-gray-300 px-6 py-2 rounded-full text-gray-600 hover:bg-gray-50 font-medium">Forward</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Email List View
                    <div className="flex-1 overflow-y-auto">
                        {filteredEmails.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Mail size={32} className="opacity-20" />
                                </div>
                                <p>Nothing in {filter}</p>
                            </div>
                        ) : (
                            filteredEmails.map(email => (
                                <div
                                    key={email.id}
                                    onClick={() => openEmail(email)}
                                    className={`flex items-center px-4 py-3 border-b border-gray-100 hover:shadow-md cursor-pointer group ${email.read ? 'bg-white' : 'bg-white font-bold'}`}
                                >
                                    <div onClick={(e) => toggleStar(e, email.id)} className="pr-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                                        <Star size={18} fill={email.starred ? "#f4b400" : "none"} className={email.starred ? "text-[#f4b400]" : ""} />
                                    </div>
                                    <div className={`w-48 truncate ${email.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                        {email.sender}
                                    </div>
                                    <div className="flex-1 truncate pr-4 text-gray-600">
                                        <span className={email.read ? '' : 'text-gray-900'}>{email.subject}</span>
                                        <span className="text-gray-400"> - {email.snippet}</span>
                                    </div>
                                    <div className={`text-xs ${email.read ? 'text-gray-500' : 'text-gray-900 font-bold'}`}>
                                        {email.time}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
