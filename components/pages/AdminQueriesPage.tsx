'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react'
import { useData, type ParentQuery } from '@/context/DataContext'

const CATEGORIES = ['Academic', 'Fees', 'Discipline', 'Medical', 'Extracurricular']
const STATUSES = ['Open', 'In Progress', 'Resolved'] as const
const PRIORITIES = ['Low', 'Medium', 'High'] as const

interface AdminQueriesPageProps {
  onNavigate: (page: 'admin-staff' | 'admin-admissions' | 'admin-queries' | 'admin' | 'dashboard') => void
}

export default function AdminQueriesPage({ onNavigate }: AdminQueriesPageProps) {
  const { queries, addQuery, updateQuery, deleteQuery, setQueries } = useData()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ParentQuery>>({})

  const handleAddClick = () => {
    setEditingId(null)
    setFormData({
      parentName: '',
      studentName: '',
      email: '',
      phone: '',
      category: '',
      subject: '',
      message: '',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      priority: 'Medium',
    })
    setOpenDialog(true)
  }

  const handleEditClick = (query: ParentQuery) => {
    setEditingId(query.id)
    setFormData(query)
    setOpenDialog(true)
  }

  const handleSave = () => {
    if (!formData.parentName || !formData.studentName || !formData.email || !formData.phone || !formData.category || !formData.subject || !formData.message) {
      alert('Please fill all required fields')
      return
    }

    if (editingId) {
      updateQuery(editingId, {
        parentName: formData.parentName || '',
        studentName: formData.studentName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        category: formData.category || '',
        subject: formData.subject || '',
        message: formData.message || '',
        createdDate: formData.createdDate || new Date().toISOString().split('T')[0],
        status: formData.status as 'Open' | 'In Progress' | 'Resolved' || 'Open',
        priority: formData.priority as 'Low' | 'Medium' | 'High' || 'Medium',
      })
    } else {
      addQuery({
        parentName: formData.parentName || '',
        studentName: formData.studentName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        category: formData.category || '',
        subject: formData.subject || '',
        message: formData.message || '',
        createdDate: formData.createdDate || new Date().toISOString().split('T')[0],
        status: formData.status as 'Open' | 'In Progress' | 'Resolved' || 'Open',
        priority: formData.priority as 'Low' | 'Medium' | 'High' || 'Medium',
      })
    }

    setOpenDialog(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this query?')) {
      deleteQuery(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Medium':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Parent Queries Management</h1>
              <p className="text-muted-foreground mt-1">Create, update, and delete parent queries</p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Queries: {queries.length}</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Query
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Query' : 'Add New Query'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Parent Name</label>
                  <Input
                    value={formData.parentName || ''}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Parent name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Student Name</label>
                  <Input
                    value={formData.studentName || ''}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Student name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select value={formData.category || ''} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <Input
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Query subject"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <Textarea
                    value={formData.message || ''}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Detailed message"
                    className="min-h-24"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Date Submitted</label>
                  <Input
                    type="date"
                    value={formData.createdDate || ''}
                    onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <Select value={formData.status || 'Open'} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <Select value={formData.priority || 'Medium'} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(priority => (
                          <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingId ? 'Update Query' : 'Add Query'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Queries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Parent Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-medium">{query.parentName}</TableCell>
                      <TableCell>{query.studentName}</TableCell>
                      <TableCell>{query.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{query.subject}</TableCell>
                      <TableCell>{new Date(query.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(query.status)}>
                          {query.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(query.priority)}>
                          {query.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(query)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete(query.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
  )
}
