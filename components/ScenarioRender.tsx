import React from 'react';
import { Scenario, ScenarioType } from '../types';
import { Mail, Smartphone, Paperclip, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ScenarioRenderProps {
  scenario: Scenario;
}

export const ScenarioRender: React.FC<ScenarioRenderProps> = ({ scenario }) => {
  const isEmail = scenario.type === ScenarioType.EMAIL;

  if (isEmail) {
    return (
      <div className="w-full h-full bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans relative">
        {/* Email Header (Simulated Outlook/Gmail) */}
        <div className="bg-gray-100 border-b border-gray-300 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs text-gray-500 font-mono">MailClient v3.0</div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{scenario.subject}</h2>
            
            <div className="flex items-start gap-4 mb-6 border-b border-gray-200 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {scenario.sender.charAt(0)}
                </div>
                <div>
                    <div className="font-semibold text-gray-800">
                        {scenario.sender} 
                        <span className="font-normal text-gray-500 text-sm ml-2">&lt;{scenario.senderAddress}&gt;</span>
                    </div>
                    <div className="text-xs text-gray-400">to me</div>
                </div>
            </div>

            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                {scenario.body}
            </div>

            {scenario.attachment && (
                <div className="mt-8 p-3 border border-gray-300 rounded-md bg-gray-50 w-64 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Paperclip size={18} className="text-gray-500" />
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium truncate">{scenario.attachment}</div>
                        <div className="text-xs text-gray-400">245 KB</div>
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  }

  // SMS / WhatsApp View
  return (
    <div className="w-[320px] mx-auto h-[600px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden relative flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
        
        {/* Status Bar */}
        <div className="h-10 bg-gray-900 w-full flex justify-between items-center px-6 pt-2 text-white text-[10px]">
            <span>9:41</span>
            <div className="flex gap-1">
                <span>5G</span>
                <div className="w-4 h-2 bg-white rounded-sm"></div>
            </div>
        </div>

        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center gap-3 z-10 shadow-md">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                {scenario.sender.charAt(0)}
            </div>
            <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">{scenario.sender}</span>
                <span className="text-gray-400 text-[10px]">{scenario.senderAddress}</span>
            </div>
        </div>

        {/* Message Body */}
        <div className="flex-1 bg-gray-900 p-4 overflow-y-auto flex flex-col gap-4">
             <div className="self-center text-gray-500 text-xs my-2">Today 9:42 AM</div>
             
             <div className="self-start bg-gray-700 text-white p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-md">
                <p className="text-sm">{scenario.body}</p>
             </div>
             
             {scenario.type === ScenarioType.WHATSAPP && (
                 <div className="self-center bg-yellow-900/30 text-yellow-500 p-2 rounded text-[10px] flex items-center gap-1 border border-yellow-700/50 mt-2">
                     <AlertTriangle size={10} />
                     Messages are end-to-end encrypted.
                 </div>
             )}
        </div>

        {/* Input Area (Fake) */}
        <div className="h-16 bg-gray-800 flex items-center px-4 gap-2">
            <div className="flex-1 h-8 bg-gray-700 rounded-full opacity-50"></div>
            <div className="w-8 h-8 bg-blue-500 rounded-full opacity-50"></div>
        </div>
    </div>
  );
};
