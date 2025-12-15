"use client";

import { ArrowLeft, ArrowRight, RefreshCw, Star } from "lucide-react";
import { useState } from "react";

export default function BrowserApp() {
    const [url, setUrl] = useState("https://phishnet-corp.internal/portal");
    const [history, setHistory] = useState<string[]>(["https://phishnet-corp.internal/portal"]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = (newUrl: string) => {
        const next = history.slice(0, currentIndex + 1);
        next.push(newUrl);
        setHistory(next);
        setCurrentIndex(next.length - 1);
        setUrl(newUrl);
    };

    const goBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setUrl(history[currentIndex - 1]);
        }
    };

    const goForward = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUrl(history[currentIndex + 1]);
        }
    };

    const reload = () => {
        // Mock reload
        const current = url;
        setUrl("");
        setTimeout(() => setUrl(current), 100);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 font-sans">
            {/* Browser Toolbar */}
            <div className="h-10 bg-slate-200 border-b border-slate-300 flex items-center px-2 space-x-2">
                <div className="flex space-x-1 text-slate-600">
                    <button onClick={goBack} disabled={currentIndex === 0} className="p-1 hover:bg-slate-300 rounded disabled:opacity-30 transition-colors"><ArrowLeft size={16} /></button>
                    <button onClick={goForward} disabled={currentIndex === history.length - 1} className="p-1 hover:bg-slate-300 rounded disabled:opacity-30 transition-colors"><ArrowRight size={16} /></button>
                    <button onClick={reload} className="p-1 hover:bg-slate-300 rounded transition-colors"><RefreshCw size={14} /></button>
                </div>

                {/* Address Bar */}
                <div className="flex-1 bg-white border border-slate-300 rounded-md h-7 flex items-center px-3 space-x-2 focus-within:ring-2 ring-blue-400 shadow-sm">
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Secure</span>
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 font-mono"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(url)}
                    />
                    <Star size={12} className="text-slate-400 cursor-pointer hover:text-yellow-400 transition-colors" />
                </div>
            </div>

            {/* Browser Content (Mocked Iframe-like behavior) */}
            <div className="flex-1 overflow-y-auto p-8 bg-white" key={url}>
                {url.includes("portal") ? (
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
                        {/* Internal Portal Header */}
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                                <div className="p-2 bg-blue-600 text-white rounded-lg">PN</div>
                                <div>
                                    <span className="text-blue-600">PhishNet</span>
                                    <span className="font-light text-slate-500 ml-2">Intranet Portal v2.0</span>
                                </div>
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="font-bold text-sm">Employee Node</div>
                                    <div className="text-xs text-green-600">Connected via VPN</div>
                                </div>
                                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                            </div>
                        </div>

                        {/* Quick Access Grid */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div onClick={() => navigate("https://phishnet-corp.internal/news")} className="group p-6 border rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-white border-blue-100 cursor-pointer">
                                <h3 className="text-lg font-bold text-blue-900 mb-2 group-hover:text-blue-600 transition-colors">📢 Company News</h3>
                                <p className="text-sm text-slate-600">Q4 Cybersecurity Awareness Month updates.</p>
                            </div>
                            <div onClick={() => navigate("https://phishnet-corp.internal/hr")} className="group p-6 border rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-white border-green-100 cursor-pointer">
                                <h3 className="text-lg font-bold text-green-900 mb-2 group-hover:text-green-600 transition-colors">👥 HR Connect</h3>
                                <p className="text-sm text-slate-600">Submit leave requests and view holidays.</p>
                            </div>
                            <div onClick={() => navigate("https://phishnet-corp.internal/it")} className="group p-6 border rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-orange-50 to-white border-orange-100 cursor-pointer">
                                <h3 className="text-lg font-bold text-orange-900 mb-2 group-hover:text-orange-600 transition-colors">💻 IT Support</h3>
                                <p className="text-sm text-slate-600">Report hardware faults or request software.</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="border rounded-xl p-6 bg-slate-50">
                            <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Recent System Alerts</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                    <span className="font-bold">CRITICAL:</span> Phishing attempts targeting HR detected. Stay vigilant.
                                </li>
                                <li className="flex items-center gap-2 text-slate-600 p-2">
                                    <span className="font-bold text-slate-800">NOTICE:</span> Password expiry policy updated to 60 days.
                                </li>
                                <li className="flex items-center gap-2 text-slate-600 p-2">
                                    <span className="font-bold text-slate-800">MAINTENANCE:</span> Server reboot scheduled for Sunday 2 AM.
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : url.includes("news") ? (
                    <div className="max-w-2xl mx-auto prose">
                        <h1 className="text-blue-900">Company News</h1>
                        <p>Welcome to the news portal. (Content mocked)</p>
                        <button onClick={() => navigate("https://phishnet-corp.internal/portal")} className="text-blue-500 underline">Back to Home</button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="text-6xl mb-4">404</div>
                        <p>Page not found on local intranet.</p>
                        <button onClick={() => navigate("https://phishnet-corp.internal/portal")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Return Home</button>
                    </div>
                )}
            </div>
        </div>
    );
}
