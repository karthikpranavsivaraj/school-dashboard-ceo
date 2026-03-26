'use client'

import { Button } from '@/components/ui/button'
import { GraduationCap, LogOut, Menu, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import AdmissionsAnalytics from '@/components/dashboard/AdmissionsAnalytics'
import StaffDetails from '@/components/dashboard/StaffDetails'
import ParentQueries from '@/components/dashboard/ParentQueries'
import Sidebar from '@/components/dashboard/Sidebar'
import InstitutionalHealthIndex from '@/components/dashboard/InstitutionalHealthIndex'
import LearningOutcomeGrowth from '@/components/dashboard/LearningOutcomeGrowth'
import RetentionAttritionAnalytics from '@/components/dashboard/RetentionAttritionAnalytics'
import ParentTrustIndex from '@/components/dashboard/ParentTrustIndex'
import TeachingEffectiveness from '@/components/dashboard/TeachingEffectiveness'
import StudentPerformanceOverview from '@/components/dashboard/StudentPerformanceOverview'
import Achievements from '@/components/dashboard/Achievements'
import StudentAchievements from '@/components/dashboard/StudentAchievements'
import { NeuralPulse } from '@/components/dashboard/NeuralPulse'
import { InterventionSimulator } from '@/components/dashboard/InterventionSimulator'

interface AdminDashboardPageProps {
  onNavigate: (page: 'dashboard' | 'staff' | 'admissions' | 'queries' | 'admin' | 'admin-staff' | 'admin-admissions' | 'admin-queries' | 'admin-staff-management' | 'student-performance' | 'admin-audit') => void
  onLogout?: () => void
}

export default function AdminDashboardPage({ onNavigate, onLogout }: AdminDashboardPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [healthData, setHealthData] = useState<any>(null)
  const [projection, setProjection] = useState({ growthImpact: '0.0', sentimentShift: 'Stable', status: 'Neutral' })
  const [isBriefLoading, setIsBriefLoading] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header - Glassmorphism */}
        <header className="bg-card/40 backdrop-blur-2xl border-b border-white/5 dark:border-slate-800/50 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-primary/20 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-foreground uppercase italic px-1">Admin Control</h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Full Access Granted</p>
                </div>
              </div>
            </div>
          </div>

          {onLogout && (
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="rounded-2xl hover:bg-destructive/10 hover:text-destructive group border border-transparent hover:border-destructive/20 h-10 px-5 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Terminate Session</span>
            </Button>
          )}
        </header>

        <main className="flex-1 overflow-auto bg-[#F8FAFC] dark:bg-[#020617] relative">
          {/* Subtle Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px]" />
          </div>

          <div className="p-8 space-y-10 max-w-[1700px] mx-auto relative z-10">
            {/* Redesigned Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/10 p-12 text-white shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-accent/40 opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative z-10 max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/80">System Administrator</span>
                </div>
                <h2 className="text-5xl font-black tracking-tighter leading-none italic uppercase">Control<br /><span className="text-primary not-italic">Center</span></h2>
                <p className="text-white/60 text-lg font-bold leading-relaxed max-w-xl">
                  Full command over institutional operations, staff management, and admissions velocity.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    disabled={isBriefLoading}
                    onClick={async () => {
                      try {
                        setIsBriefLoading(true)
                        const token = localStorage.getItem('token')
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/morning-brief`, {
                          headers: { 'Authorization': `Bearer ${token}` }
                        })
                        if (res.ok) {
                          const blob = await res.blob()
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `CEO_Morning_Brief_${new Date().toISOString().split('T')[0]}.pdf`
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                          document.body.removeChild(a)
                        }
                      } catch (err) {
                        console.error('Failed to download brief', err)
                      } finally {
                        setIsBriefLoading(false)
                      }
                    }}
                    className="rounded-2xl h-12 px-8 font-black uppercase text-xs tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {isBriefLoading ? "Generating Brief..." : "Generate Morning Briefing"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Health & Wellness Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Institutional Health & Wellness</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Real-time health telemetry</p>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                  <NeuralPulse
                    score={healthData?.currentHealth?.overall || 88}
                    sentiment={healthData?.currentHealth?.riskLevel === 'LOW' ? 'Positive' : healthData?.currentHealth?.riskLevel === 'MEDIUM' ? 'Neutral' : 'Concerned'}
                  />
                </div>
                <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                  <InstitutionalHealthIndex onDataLoad={setHealthData} />
                </div>
                <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                  <LearningOutcomeGrowth />
                </div>
              </div>
            </section>

            {/* Outcomes & Engagement Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 bg-accent rounded-full shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Student Outcomes & Engagement</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Attrition vectors & trust index</p>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                  <RetentionAttritionAnalytics />
                </div>
                <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                  <ParentTrustIndex />
                </div>
              </div>
            </section>

            {/* Strategic Forecasting */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Strategic Forecasting</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Predictive Intervention Modeling</p>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <InterventionSimulator
                  currentAttendance={healthData?.currentHealth?.efficiency || 85}
                  currentProficiency={healthData?.currentHealth?.academic || 72}
                  onChange={setProjection}
                />
                <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Target className="w-12 h-12 text-primary" />
                  </div>
                  <h4 className="text-xl font-black text-white italic uppercase mb-2 relative z-10 flex items-center gap-2">
                    Strategic Impact Engine
                    <Badge className="bg-primary text-white text-[8px] px-2 py-0">LIVE</Badge>
                  </h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 relative z-10">
                    Projected results based on your target intervention metrics:
                  </p>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status Code</p>
                      <p className="text-lg font-black text-primary italic uppercase">{projection.status}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Market Sentiment</p>
                      <p className="text-lg font-black text-emerald-500 italic uppercase">{projection.sentimentShift}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-[11px] text-slate-500 font-bold italic border-l-2 border-primary pl-4">
                    {Number(projection.growthImpact) > 5
                      ? "ALERT: High velocity growth detected. Recommend immediate staff allocation."
                      : "ADVISORY: Incremental gains expected. Maintain current operational posture."}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Strategic scenario archived in audit ledger.')}
                    className="mt-6 w-fit rounded-xl border border-white/10 text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest"
                  >
                    Archive Scenario
                  </Button>
                </div>
              </div>
            </section>

            {/* Teaching & Staff Performance */}

            {/* Academic Performance */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Academic Performance Overview</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">System-wide scholastic standing</p>
                </div>
              </div>
              <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                <StudentPerformanceOverview />
              </div>
            </section>

            {/* Student Achievements */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 bg-yellow-500 rounded-full" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Student Achievements & Competitions</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Extracurricular Excellence Tracking</p>
                </div>
              </div>
              <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                <StudentAchievements isEditable={true} />
              </div>
            </section>

            {/* Operations Analytics */}
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-indigo-500 rounded-full" />
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Operations Analytics</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Admissions Pipeline & Staff Demographics</p>
                  </div>
                </div>
                {/* Modern Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => onNavigate('admin-staff-management')}
                    className="rounded-2xl h-10 px-5 font-black uppercase text-[10px] tracking-widest bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                  >
                    Staff Directory
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('admin-admissions')}
                    className="rounded-2xl h-10 px-5 font-black uppercase text-[10px] tracking-widest border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                  >
                    Admissions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('staff')}
                    className="rounded-2xl h-10 px-5 font-black uppercase text-[10px] tracking-widest border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                  >
                    My Staff View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('queries')}
                    className="rounded-2xl h-10 px-5 font-black uppercase text-[10px] tracking-widest border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                  >
                    Queries
                  </Button>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                  <AdmissionsAnalytics />
                </div>
                <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                  <StaffDetails />
                </div>
              </div>
            </section>

            {/* School Achievements */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">School Achievements</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Institutional Recognition</p>
                </div>
              </div>
              <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                <Achievements />
              </div>
            </section>

            {/* Stakeholder Feedback */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 bg-rose-500 rounded-full" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Stakeholder Feedback</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Parent Queries & Support Tracker</p>
                </div>
              </div>
              <div className="p-2 rounded-[2rem] hover:bg-white/5 dark:hover:bg-slate-900/20 transition-all border border-transparent hover:border-white/5">
                <ParentQueries />
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}
