import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../../types/ecommerce';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! 🙏 I am Bharat Mitra, your personal AI shopping assistant. How can I help you today? You can ask me to compare products, find deals within your budget, or recommend festive gifts!',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'I found several great options for you in our catalog. Check out our electronics and festival collections!';

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I apologize, but I am momentarily experiencing network delay. Please browse our curated categories above or try asking again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Best smartphone under ₹50,000?',
    'Compare iPhone 15 vs OnePlus 12R',
    'Best cookware for Indian cooking',
    'Suggest traditional wedding gift',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-2xs" />

      {/* Slide-out Chat Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 text-yellow-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-1.5">
                <span>Bharat Mitra AI</span>
                <span className="text-[10px] bg-white/20 text-yellow-100 px-1.5 py-0.2 rounded font-semibold">
                  Gemini 3.8
                </span>
              </div>
              <div className="text-[11px] text-amber-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Catalog Grounded • Real-time ₹ Pricing</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-[#131921] text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    m.sender === 'user' ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-gray-500 bg-white p-2.5 rounded-lg border border-gray-200 w-max shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Bharat Mitra is researching the catalog...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-gray-200 overflow-x-auto scrollbar-none flex gap-1.5 text-[11px]">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, prices, or recommendations..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-full bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e49b38] text-gray-900 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 shadow-2xs shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <span className="block text-[10px] text-gray-400 text-center mt-1.5">
            Bharat Mitra provides guidance based on live BharatBazaar product catalog.
          </span>
        </div>
      </div>
    </div>
  );
};
