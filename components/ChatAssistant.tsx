import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import ButterflyIcon from './ButterflyIcon';

interface ChatAssistantProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onToggle: () => void;
  onSendMessage: (message: string) => void;
  isResponding: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-3">
    <span className="w-2 h-2 bg-violet-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-2 h-2 bg-violet-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-2 h-2 bg-violet-300 rounded-full animate-bounce"></span>
  </div>
);


const ChatAssistant: React.FC<ChatAssistantProps> = ({ messages, isOpen, onToggle, onSendMessage, isResponding }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if(isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isResponding]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <button
          onClick={onToggle}
          className="bg-violet-600 text-white rounded-full p-4 shadow-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
          aria-label="Abrir asistente de chat"
        >
          <ButterflyIcon className="w-8 h-8" />
        </button>
      </div>

      <div
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-500 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`
        }
        style={{ transformOrigin: 'bottom right' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center">
            <ButterflyIcon className="w-6 h-6 text-violet-500 mr-2" />
            <h3 className="font-bold text-slate-700">Asistente de Mariposa</h3>
          </div>
          <button onClick={onToggle} className="text-slate-500 hover:text-slate-700 text-2xl leading-none">&times;</button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-100/50">
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end max-w-[85%] ${msg.sender === 'bot' ? 'self-start' : 'self-end'}`}>
                {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-violet-400 flex items-center justify-center mr-2 flex-shrink-0"><ButterflyIcon className="w-5 h-5 text-white" /></div>}
                <div className={`p-3 rounded-2xl animate-fade-in-up ${msg.sender === 'bot' ? 'bg-violet-100 text-slate-800 rounded-bl-none' : 'bg-violet-500 text-white rounded-br-none'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isResponding && (
               <div className="flex items-end max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full bg-violet-400 flex items-center justify-center mr-2 flex-shrink-0"><ButterflyIcon className="w-5 h-5 text-white" /></div>
                  <div className="p-2 rounded-2xl bg-violet-100 text-slate-800 rounded-bl-none">
                    <TypingIndicator />
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isResponding}
              className="w-full p-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isResponding || !inputValue.trim()}
              className="bg-violet-600 text-white rounded-full p-2.5 shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3.105 3.105a1.5 1.5 0 012.122 0l7.666 7.667-2.122 2.121-7.666-7.667a1.5 1.5 0 010-2.121z" />
                <path d="M14.895 14.895a1.5 1.5 0 01-2.122 0l-7.666-7.667 2.122-2.121 7.666 7.667a1.5 1.5 0 010 2.121z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;