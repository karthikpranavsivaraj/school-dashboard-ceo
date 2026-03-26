'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { HeartPulse, Activity, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { API_URL } from '@/lib/api-config'

export default function StaffBurnoutRadar() {

    const [staffWithRisk, setStaffWithRisk] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBurnout = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`${API_URL}/analytics/staff-burnout`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    const formatted = data.map((s: any) => {
                        let riskLevel = 'Low'
                        let riskColor = 'text-emerald-500'
                        let riskBg = 'bg-emerald-500/20'
                        let riskBorder = 'border-emerald-500/30'

                        if (s.riskScore > 75) {
                            riskLevel = 'Critical'
                            riskColor = 'text-rose-500'
                            riskBg = 'bg-rose-500/20'
                            riskBorder = 'border-rose-500/30'
                        } else if (s.riskScore > 50) {
                            riskLevel = 'Elevated'
                            riskColor = 'text-amber-500'
                            riskBg = 'bg-amber-500/20'
                            riskBorder = 'border-amber-500/30'
                        }
                        
                        return {
                            id: s.id,
                            name: s.name,
                            department: s.department,
                            riskScore: s.riskScore,
                            riskLevel,
                            riskColor,
                            riskBg,
                            riskBorder,
                            workloadHours: 40 + (s.riskScore % 25),
                            parentQueries: (s.riskScore % 15) * 5,
                        }
                    }).slice(0, 5)
                    setStaffWithRisk(formatted)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchBurnout()
    }, [])

    return (
        <Card className="bg-slate-950 border-white/10 shadow-2xl overflow-hidden relative group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-amber-500/5 opacity-50 pointer-events-none" />

            <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-500/20">
                            <HeartPulse className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter">Team Burnout Radar</CardTitle>
                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Predictive HR Telemetry Active
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest animate-pulse">
                        Monitoring
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                            <Activity className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Stress Index</p>
                        <p className="text-3xl font-black text-white mt-1 tabular-nums">42%</p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-md">-5% vs Last Cycle</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                            <AlertTriangle className="w-10 h-10 text-rose-500" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Risks</p>
                        <p className="text-3xl font-black text-rose-500 mt-1 tabular-nums">{staffWithRisk.filter(s => s.riskLevel === 'Critical').length}</p>
                        <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mt-1 bg-rose-500/10 inline-block px-2 py-0.5 rounded-md">Intervention Needed</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1">Top flagged personnel</h4>
                    <ScrollArea className="h-[280px] w-full pr-4">
                        <div className="space-y-3">
                            {staffWithRisk.map((staff, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={staff.id}
                                    className={`p-4 rounded-xl border flex flex-col gap-3 group/item transition-all hover:translate-x-1 ${staff.riskBorder} bg-white/5`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${staff.riskBg} flex items-center justify-center ${staff.riskColor} font-black text-xs uppercase shadow-inner`}>
                                                {staff.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-white truncate max-w-[150px]">{staff.name}</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{staff.department}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest ${staff.riskBg} ${staff.riskColor} border-none`}>
                                            {staff.riskLevel}
                                        </Badge>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Burnout Trajectory</span>
                                            <span className={staff.riskColor}>{staff.riskScore}%</span>
                                        </div>
                                        {/* Progress Bar styled as a high-tech meter */}
                                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex">
                                            <div
                                                className={`h-full ${staff.riskColor.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                                                style={{ width: `${staff.riskScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Weekly Load</span>
                                            <span className="text-[10px] font-bold text-slate-300">{staff.workloadHours} hrs</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Open Queries</span>
                                            <span className="text-[10px] font-bold text-slate-300">{staff.parentQueries} active</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
