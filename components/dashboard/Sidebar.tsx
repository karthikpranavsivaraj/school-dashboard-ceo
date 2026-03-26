'use client'

import { BarChart3, Users, BookOpen, MessageSquare, X, Settings, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: 'dashboard' | 'staff' | 'admissions' | 'queries' | 'admin' | 'admin-audit' | 'student-performance') => void
}

const menuItems = [
  { icon: Users, label: 'Staff Management', page: 'staff' as const },
  { icon: BookOpen, label: 'Admissions', page: 'admissions' as const },
  { icon: MessageSquare, label: 'Parent Queries', page: 'queries' as const },
  { icon: GraduationCap, label: 'Student Performance', page: 'student-performance' as const },
]

const adminItems = [
  { icon: Settings, label: 'Admin Panel', page: 'admin' as const },
  { icon: Users, label: 'Audit Logs (SecOps)', page: 'admin-audit' as const },
]

export default function Sidebar({ isOpen, onClose, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-sidebar-foreground">Menu</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-sidebar-accent rounded transition-colors"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-3"
                    onClick={() => {
                      onNavigate(item.page)
                      onClose()
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>

            {/* Admin Section */}
            <div className="pt-4 mt-4 border-t border-sidebar-border">
              <p className="text-xs font-semibold text-sidebar-foreground/60 px-2 py-2 uppercase">Administration</p>
              <div className="space-y-2">
                {adminItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-3"
                      onClick={() => {
                        onNavigate(item.page)
                        onClose()
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* Footer info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-sidebar-accent/50 rounded-lg p-3">
              <p className="text-xs text-sidebar-foreground font-medium">Admin Panel</p>
              <p className="text-xs text-sidebar-accent-foreground/70 mt-1">Full Management Access</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
