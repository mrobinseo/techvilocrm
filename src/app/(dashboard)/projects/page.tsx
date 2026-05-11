"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function ProjectsPage() {
  const { projects: allProjects, clients: allClients, addProject, addPartialPayment, currentUser } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager'
  
  // Ownership Filtering
  const projects = isAdminOrManager 
    ? allProjects 
    : allProjects.filter(p => (p as any).createdBy === currentUser?.id)
    
  const clients = isAdminOrManager
    ? allClients
    : allClients.filter(c => (c as any).createdBy === currentUser?.id)

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    // ... (previous logic)
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newProject = {
      id: Math.random().toString(),
      name: (formData.get("projectName") as string) || "New Service",
      client: (formData.get("client") as string) || "Demo Client",
      service: (formData.get("service") as string) || "General",
      status: (formData.get("status") as string) || "Active",
      billingType: (formData.get("billing") as string) || "Recurring",
      amount: Number(formData.get("total")) || 0,
      paidAmount: 0,
      dueAmount: Number(formData.get("total")) || 0,
      nextPaymentDate: (formData.get("nextDate") as string) || null,
    }
    addProject(newProject)
    setIsDialogOpen(false)
  }

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const handlePartialPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const amountPaid = Number(formData.get("amount")) || 0

    if (selectedProjectId) {
      addPartialPayment(selectedProjectId, amountPaid)
    }
    setPaymentDialogOpen(false)
    setSelectedProjectId(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-zinc-400">Track services and project progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Plus className="size-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
              <form onSubmit={handleCreateProject}>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Enter the details of the new project here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Project Name</Label>
                    <Input name="projectName" placeholder="e.g. Website Redesign" className="bg-zinc-900 border-zinc-800" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="client" className="text-zinc-300">Client</Label>
                      <Select name="client">
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-h-[200px]">
                          {clients.map(c => (
                            <SelectItem key={c.id} value={c.company}>{c.company}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="service" className="text-zinc-300">Service Type</Label>
                      <Select name="service">
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="AI Automation">AI Automation</SelectItem>
                          <SelectItem value="Custom Software">Custom Software</SelectItem>
                          <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                          <SelectItem value="SEO Service">SEO Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="billing" className="text-zinc-300">Billing Type</Label>
                      <Select name="billing" defaultValue="Recurring (Monthly)">
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                          <SelectItem value="Recurring (Monthly)">Recurring (Monthly)</SelectItem>
                          <SelectItem value="One-time">One-time Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="total" className="text-zinc-300">Amount (BDT)</Label>
                      <Input name="total" id="total" type="number" placeholder="40000" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nextDate" className="text-zinc-300">Next Payment Date</Label>
                      <Input name="nextDate" id="nextDate" type="date" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status" className="text-zinc-300">Status</Label>
                      <Select name="status" defaultValue="Active">
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Create Project</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">All Projects</CardTitle>
          <CardDescription className="text-zinc-400">Overview of all active and past projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-950/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Service/Project Name</TableHead>
                  <TableHead className="text-zinc-400">Client</TableHead>
                  <TableHead className="text-zinc-400">Billing Type</TableHead>
                  <TableHead className="text-zinc-400">Total/Monthly</TableHead>
                  <TableHead className="text-zinc-400">Paid</TableHead>
                  <TableHead className="text-zinc-400">Due</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  {isAdminOrManager && <TableHead className="text-zinc-400 text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="font-medium text-zinc-100">
                      <div>{project.name}</div>
                      <div className="text-xs text-zinc-500 font-normal">{project.service}</div>
                    </TableCell>
                    <TableCell className="text-zinc-300">{project.client}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-zinc-800/50 text-zinc-300 border-zinc-700">
                        {project.billingType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">৳ {project.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-emerald-400">৳ {project.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-rose-400 font-medium">
                      {project.dueAmount > 0 ? `৳ ${project.dueAmount.toLocaleString()}` : '৳ 0'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline"
                        className={
                          project.status === 'Active' ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20' :
                          project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20' :
                          project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20' :
                          'text-zinc-400 border-zinc-700 bg-zinc-800/50'
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                        onClick={() => {
                          setSelectedProjectId(project.id)
                          setPaymentDialogOpen(true)
                        }}
                      >
                        Add Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Partial Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 text-zinc-100">
          <form onSubmit={handlePartialPayment}>
            <DialogHeader>
              <DialogTitle>Receive Payment</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Enter the partial or full amount received from the client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-zinc-300">Amount Received (BDT)</Label>
                <Input name="amount" id="amount" type="number" placeholder="e.g. 5000" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" autoFocus />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">Save Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
