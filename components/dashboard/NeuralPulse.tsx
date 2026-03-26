'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, Zap } from 'lucide-react'

interface NeuralPulseProps {
    score: number; // 0 to 100
    sentiment: 'Positive' | 'Neutral' | 'Concerned';
    label?: string;
}

export function NeuralPulse({ score, sentiment, label = "Institutional Health" }: NeuralPulseProps) {
    // Map sentiment to colors
    const colors = {
        Positive: {
            primary: '#10b981', // emerald-500
            secondary: '#34d399', // emerald-400
            glow: 'rgba(16, 185, 129, 0.4)'
        },
        Neutral: {
            primary: '#3b82f6', // blue-500
            secondary: '#60a5fa', // blue-400
            glow: 'rgba(59, 130, 246, 0.4)'
        },
        Concerned: {
            primary: '#f43f5e', // rose-500
            secondary: '#fb7185', // rose-400
            glow: 'rgba(244, 63, 94, 0.4)'
        }
    }

    const activeColor = colors[sentiment] || colors.Neutral

    return (
        <Card className="bg-slate-950 border-slate-800 overflow-hidden relative group">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[220px]">
                {/* Animated Background Aura */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at center, ${activeColor.glow} 0%, transparent 70%)`
                    }}
                />

                {/* The Pulse Sphere */}
                <div className="relative mb-6">
                    <motion.div
                        animate={{
                            boxShadow: [
                                `0 0 20px ${activeColor.glow}`,
                                `0 0 50px ${activeColor.glow}`,
                                `0 0 20px ${activeColor.glow}`
                            ],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: Math.max(1, 3 - (score / 50)), // Faster pulse for higher scores
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
                        style={{
                            background: `linear-gradient(135deg, ${activeColor.primary}, ${activeColor.secondary})`,
                            border: `2px solid rgba(255, 255, 255, 0.1)`
                        }}
                    >
                        <Activity className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Satellite Rings */}
                    {[0.8, 1.2, 1.6].map((delay, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: "linear"
                            }}
                            className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"
                        />
                    ))}
                </div>

                {/* Metrics Overlay */}
                <div className="text-center z-20">
                    <h3 className="text-4xl font-black text-white tracking-tighter mb-1">{score}%</h3>
                    <div className="flex items-center justify-center gap-2">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
                    </div>
                    <p className={`text-[9px] font-black uppercase mt-3 px-3 py-1 rounded-full border inline-block`}
                        style={{
                            color: activeColor.primary,
                            borderColor: `${activeColor.primary}20`,
                            backgroundColor: `${activeColor.primary}05`
                        }}>
                        Status: {sentiment}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
