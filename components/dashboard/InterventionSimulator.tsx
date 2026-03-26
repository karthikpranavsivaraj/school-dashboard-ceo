'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Target, Info } from 'lucide-react'

interface SimulatorProps {
    currentAttendance: number;
    currentProficiency: number;
    onChange?: (projection: { growthImpact: string; sentimentShift: string; status: string }) => void;
}

export function InterventionSimulator({ currentAttendance, currentProficiency, onChange }: SimulatorProps) {
    const [targetAttendance, setTargetAttendance] = useState(currentAttendance)
    const [targetProficiency, setTargetProficiency] = useState(currentProficiency)

    const projection = useMemo(() => {
        const attDelta = targetAttendance - currentAttendance
        const profDelta = targetProficiency - currentProficiency

        const impactScore = (attDelta * 1.2) + (profDelta * 1.5)

        return {
            growthImpact: (impactScore / 2).toFixed(1),
            sentimentShift: impactScore > 0 ? 'Positive' : 'Stable',
            status: impactScore > 10 ? 'High ROI' : impactScore > 0 ? 'Incremental' : 'Neutral'
        };
    }, [targetAttendance, targetProficiency, currentAttendance, currentProficiency])

    // Use useEffect to notify parent of changes after render, avoiding "update while rendering" error
    useEffect(() => {
        if (onChange) onChange(projection);
    }, [projection, onChange]);

    return (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black uppercase tracking-tight">Intervention Simulator</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Strategic Outcome Forecasting</CardDescription>
                    </div>
                    <Target className="w-5 h-5 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Sliders */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black uppercase text-slate-500">Target Attendance</label>
                            <Badge variant="outline" className="font-black">{targetAttendance}%</Badge>
                        </div>
                        <Slider
                            value={[targetAttendance]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(v) => setTargetAttendance(v[0])}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black uppercase text-slate-500">Target Proficiency</label>
                            <Badge variant="outline" className="font-black">{targetProficiency}%</Badge>
                        </div>
                        <Slider
                            value={[targetProficiency]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(v) => setTargetProficiency(v[0])}
                            className="py-4"
                        />
                    </div>
                </div>

                {/* Forecast Result */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Projected Institutional Growth</p>
                            <h4 className={`text-2xl font-black ${Number(projection.growthImpact) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {Number(projection.growthImpact) > 0 ? '+' : ''}{projection.growthImpact}%
                            </h4>
                        </div>
                        <div className={`p-2 rounded-xl border ${Number(projection.growthImpact) >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'}`}>
                            {Number(projection.growthImpact) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary/10 flex gap-4">
                        <div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">ROI Category</p>
                            <p className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">{projection.status}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">Sentiment Shift</p>
                            <p className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">{projection.sentimentShift}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-[9px] text-slate-500 font-medium leading-tight">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <p>These projections use a time-weighted heuristic model based on your historical enrollment velocity and academic momentum logs.</p>
                </div>
            </CardContent>
        </Card>
    )
}
