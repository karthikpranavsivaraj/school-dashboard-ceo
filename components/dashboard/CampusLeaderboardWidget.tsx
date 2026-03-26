'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, TrendingUp } from 'lucide-react'
import { API_URL } from '@/lib/api-config'

export default function CampusLeaderboardWidget() {
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Natively simulate campus fetching based on available historical metrics.
        // We synthesize this using the overall system health index to rank "mock" branches for the UI,
        // as the DB currently only holds single-tenant data. 
        fetchLeaderboardData()
    }, [])

    const fetchLeaderboardData = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_URL}/analytics/branches-health`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setLeaderboard(data.map((campus: any) => ({
                    name: campus.name,
                    score: campus.healthScore,
                    trend: campus.trend === 'up' ? '+1.2%' : '-0.5%'
                })))
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="col-span-1 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border-white/5 dark:border-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    Campus Performance Matrix
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="animate-pulse flex flex-col gap-4 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 mt-2">
                        {leaderboard.map((campus, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/30 dark:bg-slate-800/40 rounded-xl border border-white/5 relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : 'bg-orange-600'}`} />
                                <div className="pl-2 flex items-center gap-3">
                                    <span className="text-lg font-black text-muted-foreground opacity-50">#{idx + 1}</span>
                                    <p className="text-xs font-black text-foreground">{campus.name}</p>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                    <div>
                                        <p className="text-xs font-black text-emerald-500">{campus.score}</p>
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Vitality</p>
                                    </div>
                                    <div className={`text-[10px] font-black uppercase p-1.5 rounded-lg ${campus.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {campus.trend}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
