'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Menu, Users } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import CEOSidebar from '@/components/dashboard/CEOSidebar'

interface Student {
  id: string
  name: string
  rollNumber: string
  mathematics: number
  english: number
  science: number
  socialStudies: number
  overall: number
  grade: string
}

interface ClassDetailsPageProps {
  onNavigate: (page: 'dashboard' | 'staff' | 'admissions' | 'queries' | 'admin' | 'student-performance') => void
  className?: string
  section?: string
}

const generateMockStudents = (className: string, section: string): Student[] => {
  const students: Student[] = []
  const studentCount = 30
  
  for (let i = 1; i <= studentCount; i++) {
    const math = Math.floor(Math.random() * 40) + 60
    const english = Math.floor(Math.random() * 40) + 60
    const science = Math.floor(Math.random() * 40) + 60
    const social = Math.floor(Math.random() * 40) + 60
    const overall = Math.round((math + english + science + social) / 4)
    
    let grade = 'F'
    if (overall >= 90) grade = 'A+'
    else if (overall >= 80) grade = 'A'
    else if (overall >= 70) grade = 'B'
    else if (overall >= 60) grade = 'C'
    else if (overall >= 50) grade = 'D'

    students.push({
      id: `${className}-${section}-${i}`,
      name: `Student ${i}`,
      rollNumber: `${className.slice(-1)}${section}${i.toString().padStart(2, '0')}`,
      mathematics: math,
      english: english,
      science: science,
      socialStudies: social,
      overall: overall,
      grade: grade
    })
  }
  
  return students.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
}

export default function ClassDetailsPage({ onNavigate, className = 'Class 9', section = 'A' }: ClassDetailsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('admin')
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserRole(userData.role || 'admin')
    }
  }, [])

  useEffect(() => {
    setStudents(generateMockStudents(className, section))
  }, [className, section])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800'
      case 'A': return 'bg-green-100 text-green-700'
      case 'B': return 'bg-blue-100 text-blue-800'
      case 'C': return 'bg-yellow-100 text-yellow-800'
      case 'D': return 'bg-orange-100 text-orange-800'
      default: return 'bg-red-100 text-red-800'
    }
  }

  const classAverage = students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.overall, 0) / students.length) : 0
  const subjectAverages = {
    mathematics: students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.mathematics, 0) / students.length) : 0,
    english: students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.english, 0) / students.length) : 0,
    science: students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.science, 0) / students.length) : 0,
    socialStudies: students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.socialStudies, 0) / students.length) : 0,
  }

  return (
    <div className="flex h-screen bg-background">
      {userRole === 'ceo' ? (
        <CEOSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onNavigate={onNavigate} 
        />
      ) : (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onNavigate={onNavigate} 
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{className} - Section {section}</h1>
                <p className="text-sm text-muted-foreground">Student Performance Details</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate('student-performance')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </Button>
          </div>
        </header>

        <div className="flex-1 p-8 bg-background overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">{students.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{classAverage}%</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mathematics Avg</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{subjectAverages.mathematics}%</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">English Avg</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{subjectAverages.english}%</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Science Avg</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{subjectAverages.science}%</span>
                </CardContent>
              </Card>
            </div>

            {/* Student Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">Mathematics</TableHead>
                        <TableHead className="text-center">English</TableHead>
                        <TableHead className="text-center">Science</TableHead>
                        <TableHead className="text-center">Social Studies</TableHead>
                        <TableHead className="text-center">Overall %</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell className="text-center">{student.mathematics}%</TableCell>
                          <TableCell className="text-center">{student.english}%</TableCell>
                          <TableCell className="text-center">{student.science}%</TableCell>
                          <TableCell className="text-center">{student.socialStudies}%</TableCell>
                          <TableCell className="text-center font-medium">{student.overall}%</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getGradeColor(student.grade)}>
                              {student.grade}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}