'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Menu, Users, BookOpen } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import CEOSidebar from '@/components/dashboard/CEOSidebar'

interface ClassData {
  id: string
  name: string
  sections: string[]
  totalStudents: number
  averagePerformance: number
}

interface StudentPerformancePageProps {
  onNavigate: (page: string) => void
  onClassSelect?: (className: string, section: string) => void
}

// Mock classes removed in favor of dynamic fetch

export default function StudentPerformancePage({ onNavigate, onClassSelect }: StudentPerformancePageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('admin')

  const [classesData, setClassesData] = useState<ClassData[]>([])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserRole(userData.role || 'admin')
    }

    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token')
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const res = await fetch(`${url}/api/analytics/classes-performance`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setClassesData(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchClasses()
  }, [])

  const handleClassClick = (className: string, section: string) => {
    if (onClassSelect) {
      onClassSelect(className, section)
    }
    onNavigate('class-details')
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
              <h1 className="text-2xl font-bold text-foreground">Student Performance</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 bg-background overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="text-muted-foreground">Select a class and section to view detailed student performance data</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classesData.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No class performance data found. Make sure students and grades are loaded.
                </div>
              )}
              {classesData.map((classData) => (
                <Card key={classData.id} className="border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {classData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Students:</span>
                        <span className="font-medium">{classData.totalStudents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Performance:</span>
                        <span className="font-medium">{classData.averagePerformance}%</span>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-3">Sections:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {classData.sections.map((section) => (
                            <Button
                              key={section}
                              variant="outline"
                              size="sm"
                              onClick={() => handleClassClick(classData.name, section)}
                              className="justify-center"
                            >
                              Section {section}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}