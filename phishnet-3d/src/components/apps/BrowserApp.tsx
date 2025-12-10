"use client";

import { ArrowLeft, ArrowRight, RefreshCw, Star } from "lucide-react";
import { useState } from "react";

export default function BrowserApp() {
    const [url, setUrl] = useState("https://phishnet-corp.internal/portal");

    return (
        <div className="h-full flex flex-col bg-slate-50 font-sans">
            {/* Browser Toolbar */}
            <div className="h-10 bg-slate-200 border-b border-slate-300 flex items-center px-2 space-x-2">
                <div className="flex space-x-1 text-slate-600">
                    <button className="p-1 hover:bg-slate-300 rounded"><ArrowLeft size={16} /></button>
                    <button className="p-1 hover:bg-slate-300 rounded"><ArrowRight size={16} /></button>
                    <button className="p-1 hover:bg-slate-300 rounded"><RefreshCw size={14} /></button>
                </div>

                {/* Address Bar */}
                <div className="flex-1 bg-white border border-slate-300 rounded-md h-7 flex items-center px-3 space-x-2 focus-within:ring-2 ring-blue-400">
                    <span className="text-green-600 text-xs font-bold">🔒 Secure</span>
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        readOnly
                    />
                    <Star size={12} className="text-slate-400" />
                </div>
            </div>

            {/* Browser Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8 border-b pb-4">
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-blue-600">PhishNet</span>
                            <span className="font-light">Intranet</span>
                        </h1>
                        <div className="text-sm text-slate-500">Welcome, User</div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-blue-50 border-blue-100 cursor-pointer">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Company News</h3>
                            <p className="text-sm text-blue-700">Latest updates on Q4 Targets and Security Protocols.</p>
                        </div>
                        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-green-50 border-green-100 cursor-pointer">
                            <h3 className="text-lg font-bold text-green-900 mb-2">HR Portal</h3>
                            <p className="text-sm text-green-700">Access payslips, leave requests, and employee directory.</p>
                        </div>
                        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-orange-50 border-orange-100 cursor-pointer col-span-2">
                            <h3 className="text-lg font-bold text-orange-900 mb-2">IT Helpdesk</h3>
                            <p className="text-sm text-orange-700">Submit tickets for hardware issues or software access.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
