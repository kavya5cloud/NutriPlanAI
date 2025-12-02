import React, { useState, useRef, useEffect } from 'react';
import { chatWithCoach } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ChatCoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your personal nutrition coach. Ask me anything about diet, macros, or healthy habits!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithCoach(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-full flex flex-col max-w-4xl mx-auto md:p-6 pb-20 md:pb-6">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-10 h-10 rounded-lg border-2 border-slate-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]
              ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-emerald-200 text-slate-900'}
            `}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`
              max-w-[85%] rounded-2xl p-4 border-2 border-slate-900 text-lg leading-relaxed shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)]
              ${msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none' 
                : 'bg-white text-slate-900 rounded-tl-none'}
            `}>
              <ReactMarkdown 
                components={{
                  ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-emerald-600" {...props} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
              <div className={`text-xs mt-2 font-bold ${msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg border-2 border-slate-900 bg-emerald-200 text-slate-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
               <Bot size={20} />
            </div>
            <div className="bg-white border-2 border-slate-900 rounded-2xl rounded-tl-none p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] flex items-center gap-3">
              <span className="text-slate-500 font-bold">Thinking</span>
              <span className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce border border-slate-900" style={{animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce border border-slate-900" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce border border-slate-900" style={{animationDelay: '300ms'}}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white md:rounded-2xl border-t-2 md:border-2 border-slate-900 md:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <form onSubmit={handleSend} className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach..."
            className="flex-1 bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:shadow-[inset_2px_2px_0px_0px_#e2e8f0] transition-all font-medium text-lg placeholder:text-slate-400"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-300 disabled:border-slate-400 text-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center w-14"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};