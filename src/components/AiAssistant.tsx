/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, X, Bot, User, 
  Loader2, Maximize2, Minimize2,
  BrainCircuit, ChevronRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Student } from '../types';

interface AiAssistantProps {
  students: Student[];
}

export default function AiAssistant({ students }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemPrompt = `
        You are EduStream AI, an advanced academic assistant for a Student Management System.
        You have access to the following student database:
        ${JSON.stringify(students.map(s => ({
          name: s.name,
          roll: s.rollNumber,
          dept: s.department,
          year: s.year,
          cgpa: s.cgpa,
          attendance: s.attendance,
          status: s.status,
          performance: s.subjects
        })))}
        
        Guidelines:
        1. Answer questions concisely based strictly on the provided data.
        2. Format performance insights clearly (e.g., using bullet points).
        3. Highlight trends (e.g., "Year 3 has the highest average attendance").
        4. If someone is "at-risk" (CGPA < 7 or Attendance < 75%), suggest targeted subject support.
        5. Use a professional, helpful, and data-driven tone.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't analyze the data at this moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Failed to connect to the AI engine. Please ensure your API key is configured correctly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl shadow-blue-500/20 border border-slate-800 flex items-center gap-3 transition-all group"
        >
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="font-bold pr-2">EduStream AI</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse border-2 border-slate-900" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '600px',
              width: isMinimized ? '300px' : '450px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">EduStream AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Analyzing Data</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
                >
                  {messages.length === 0 && (
                    <div className="text-center mt-10 space-y-4">
                      <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-slate-100 italic">
                        <Sparkles className="w-8 h-8 text-blue-500" />
                      </div>
                      <h4 className="font-bold text-slate-800">Ask me anything about your students!</h4>
                      <div className="grid grid-cols-1 gap-2 max-w-[280px] mx-auto">
                        {[
                          "Who has the highest CGPA?",
                          "Summarize Year 3 attendance",
                          "List at-risk CS students",
                          "Compare IT and CS metrics"
                        ].map(suggestion => (
                          <button 
                            key={suggestion}
                            onClick={() => {
                              setInput(suggestion);
                            }}
                            className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:text-blue-600 transition-all text-left flex items-center justify-between group shadow-sm hover:shadow-md"
                          >
                            {suggestion}
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'bg-white border border-slate-100 text-slate-800 shadow-sm whitespace-pre-wrap'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Processing Intelligence...</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <form 
                  onSubmit={handleQuery}
                  className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe what you want to know..."
                    className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/20 active:scale-90"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
