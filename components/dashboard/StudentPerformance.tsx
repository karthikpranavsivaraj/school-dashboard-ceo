'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Student {
  id: string
  name: string
  rollNumber: string
  class: string
  section: string
  mathematics: number
  english: number
  science: number
  socialStudies: number
  overall: number
  grade: string
}

export default function StudentPerformance() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudents = () => {
      const savedStudents = localStorage.getItem('students')
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents))
      }
      setLoading(false)
    }

    loadStudents()

    // Poll for changes every 2 seconds
    const interval = setInterval(loadStudents, 2000)

    const handleStudentsUpdate = () => {
      loadStudents()
    }
    
    window.addEventListener('studentsUpdated', handleStudentsUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('studentsUpdated', handleStudentsUpdate)
    }
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Student Performance Overview</CardTitle>
          <CardDescription>Academic performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const totalStudents = students.length
  const averageMarks = students.length > 0 ? (students.reduce((sum, s) => sum + s.overall, 0) / students.length).toFixed(1) : '0'
  const passPercentage = totalStudents > 0 ? ((students.filter(s => s.overall >= 60).length / totalStudents) * 100).toFixed(1) : '0'
  
  const gradeDistribution = [
    { grade: 'A+', students: students.filter(s => s.grade === 'A+').length },
    { grade: 'A', students: students.filter(s => s.grade === 'A').length },
    { grade: 'B', students: students.filter(s => s.grade === 'B').length },
    { grade: 'C', students: students.filter(s => s.grade === 'C').length },
    { grade: 'D', students: students.filter(s => s.grade === 'D').length },
    { grade: 'F', students: students.filter(s => s.grade === 'F').length },
  ]

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">Student Performance Overview</CardTitle>
        <CardDescription>Real-time academic metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Students</p>
            <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
          </div>
          <div className="bg-accent/10 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Average Marks</p>
            <p className="text-2xl font-bold text-accent">{averageMarks}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Pass %</p>
            <p className="text-2xl font-bold text-primary">{passPercentage}%</p>
          </div>
        </div>

        {totalStudents > 0 && (
          <div className="flex items-center gap-2 bg-accent/10 rounded-lg p-3">
            <TrendingUp className="w-5 h-5 text-accent" />
            <div>
              <p className="font-semibold text-accent">Performance Tracking</p>
              <p className="text-xs text-muted-foreground">{passPercentage}% of students are passing</p>
            </div>
          </div>
        )

        {gradeDistribution && gradeDistribution.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Grade-wise Distribution</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="grade" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: `1px solid var(--color-border)`,
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                  />
                  <Bar dataKey="students" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
