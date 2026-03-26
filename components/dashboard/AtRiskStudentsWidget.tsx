'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingDown } from 'lucide-react'
import { API_URL } from '@/lib/api-config'

export default function AtRiskStudentsWidget() {
    const [atRiskStudents, setAtRiskStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAtRiskData()
    }, [])

    const fetchAtRiskData = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_URL}/analytics/predictions/risk-assessment`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setAtRiskStudents(data.filter((s: any) => s.status === 'High' || s.status === 'Medium').slice(0, 5))
            }
        } catch (error) {
            console.error('Failed to fetch risk data', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="col-span-1 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border-white/5 dark:border-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    At-Risk Early Warning
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="animate-pulse flex flex-col gap-4 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
                        ))}
                    </div>
                ) : atRiskStudents.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                        No at-risk students detected
                    </div>
                ) : (
                    <div className="space-y-4 mt-2">
                        {atRiskStudents.map((student, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/30 dark:bg-slate-800/40 rounded-xl border border-white/5">
                                <div>
                                    <p className="text-xs font-black text-foreground">{student.studentName}</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Class {student.grade} - Sec {student.section}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className={`text-xs font-black ${student.status === 'High' ? 'text-rose-500' : 'text-amber-500'}`}>
                                            {student.riskScore}%
                                        </p>
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Risk Index</p>
                                    </div>
                                    <Badge variant="outline" className={`text-[9px] font-black uppercase border-none ${student.status === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {student.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
