import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessage, Scenario } from '../types';
import { getGuardianResponse } from '../services/geminiService';

interface DigitalGuardianProps {
  scenario: Scenario;
}

export const DigitalGuardian: React.FC<DigitalGuardianProps> = ({ scenario }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Scanning incoming communication... I am the Digital Guardian. If you suspect this ${scenario.type.toLowerCase()} is malicious, you can consult me for analysis tokens. What looks suspicious to you?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset chat when scenario changes
  useEffect(() => {
    setMessages([ {
      id: `init-${scenario.id}`,
      role: 'model',
      text: `New feed detected. Source: ${scenario.sender}. I am ready to assist. What is your assessment?`,
      timestamp: Date.now()
    }]);
  }, [scenario.id]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await getGuardianResponse([...messages, userMsg], scenario);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyber-gray border border-cyber-blue/30 rounded-lg overflow-hidden glass-panel">
      {/* Header */}
      <div className="bg-cyber-blue/10 p-3 border-b border-cyber-blue/20 flex items-center gap-2">
        <Bot className="text-cyber-blue" />
        <div>
            <h3 className="font-mono text-cyber-blue font-bold text-sm">DIGITAL GUARDIAN</h3>
            <div className="text-[10px] text-cyber-blue/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                ONLINE // RAG-ENABLED
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 text-xs md:text-sm rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded-tr-none' 
                  : 'bg-gray-800/80 text-gray-200 border border-gray-700 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/80 p-3 rounded-lg rounded-tl-none flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-cyber-purple" />
                <span className="text-xs text-gray-400">Analyzing patterns...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for help analyzing this threat..."
          className="flex-1 bg-cyber-dark border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-cyber-blue text-black p-2 rounded hover:bg-white transition-colors disabled:opacity-50"
        >
            <Send size={16} />
        </button>
      </div>
    </div>
  );
};
