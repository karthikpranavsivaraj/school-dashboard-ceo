'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Zap, ChevronRight, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
    id: string
    role: 'user' | 'ai'
    content: string
    timestamp: string
}

const SUGGESTED_PROMPTS = [
    "Show me the top 5 students at risk of dropping out.",
    "Draft a strategic memo to staff about declining attendance.",
    "Summarize the parent sentiment from yesterday."
]

export default function CEOCopilot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: 'Quantum Engine initialized. How can I assist you with your strategic oversight today, CEO?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [inputVal, setInputVal] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = async (text: string) => {
        if (!text.trim()) return

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages(prev => [...prev, newUserMsg])
        setInputVal('')
        setIsTyping(true)

        // Simulate AI thinking and responding based on keywords
        setTimeout(() => {
            let aiResponse = "I've logged that query. Based on current vectors, I recommend pulling the latest analytics report."

            const lowerText = text.toLowerCase()
            if (lowerText.includes('risk') || lowerText.includes('dropping out')) {
                aiResponse = "Currently, there are 8 students flagged for systemic attendance issues across Grade 9 and 10 cohorts. I have forwarded their profiles to the retention counselor and flagged them in the CRM."
            } else if (lowerText.includes('memo') || lowerText.includes('staff')) {
                aiResponse = "Drafting memo... Subject: Urgent - Attendance Mitigation Strategy. \n\n'Team, we are seeing a 15% dip in attendance velocity this week. Please review your flagged rosters immediately.' \n\nI have saved this to your outbox for review."
            } else if (lowerText.includes('sentiment') || lowerText.includes('parent')) {
                aiResponse = "Parent sentiment was heavily focused on 'Extracurricular Activities' and 'Bus Routes' yesterday. Overall sentiment index is Positive (72%), but transportation specifically is trending Concerned (-14%)."
            }

            const newAiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: aiResponse,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, newAiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-slate-900 border border-white/10 shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_50px_rgba(56,189,248,0.5)] transition-all group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <Bot className="w-8 h-8 text-primary relative z-10 animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-8 z-50 w-[400px] h-[600px] bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">CEO Copilot</h3>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">Online & Synchronized</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user'
                                                ? 'bg-primary/20 border border-primary/30 rounded-br-sm'
                                                : 'bg-white/5 border border-white/5 rounded-bl-sm'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {msg.role === 'user' ? (
                                                    <User className="w-3 h-3 text-primary" />
                                                ) : (
                                                    <Zap className="w-3 h-3 text-emerald-500" />
                                                )}
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                                                    {msg.role === 'user' ? 'Executive Core' : 'Quantum Engine'} • {msg.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm p-4 w-20 flex items-center justify-center gap-1">
                                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/5">
                            {messages.length === 1 && (
                                <div className="mb-4 space-y-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Suggested Protocols</p>
                                    <div className="flex flex-col gap-2">
                                        {SUGGESTED_PROMPTS.map((prompt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(prompt)}
                                                className="text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all text-[11px] font-bold text-slate-300 flex items-center justify-between group"
                                            >
                                                <span className="truncate pr-4">{prompt}</span>
                                                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-primary shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSend(inputVal)
                                }}
                                className="relative flex items-center"
                            >
                                <div className="absolute left-3 p-1.5 bg-primary/20 rounded-lg">
                                    <Zap className="w-3 h-3 text-primary" />
                                </div>
                                <Input
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    placeholder="Initiate command sequence..."
                                    className="w-full bg-slate-950/50 border-white/10 h-12 rounded-xl pl-12 pr-12 focus:border-primary/50 focus:ring-primary/20 text-xs font-bold text-white placeholder:text-slate-600"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputVal.trim() || isTyping}
                                    className="absolute right-2 p-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:hover:bg-primary text-white rounded-lg transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
