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
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClientsPage() {
  const { clients: allClients, addClient, currentUser } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager'
  
  // Ownership Filtering
  const clients = isAdminOrManager 
    ? allClients 
    : allClients.filter(c => (c as any).createdBy === currentUser?.id)

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    // ... (previous logic)
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newClient = {
      id: Math.random().toString(),
      name: (formData.get("name") as string) || "New Client",
      company: (formData.get("company") as string) || "New Company",
      email: (formData.get("email") as string) || "email@example.com",
      phone: (formData.get("phone") as string) || "+880 000",
      status: "Active"
    }
    addClient(newClient)
    setIsDialogOpen(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Clients</h1>
          <p className="text-zinc-400 text-sm">Manage your business contacts and leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Plus className="size-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
              <form onSubmit={handleCreateClient}>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Enter the details of the new client or lead here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-zinc-300">Name</Label>
                  <Input name="name" id="name" placeholder="John Doe" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company" className="text-zinc-300">Company</Label>
                  <Input name="company" id="company" placeholder="Acme Corp" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <Input name="email" id="email" type="email" placeholder="john@example.com" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                  <Input name="phone" id="phone" placeholder="+1 234 567 890" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-zinc-300">Status</Label>
                  <Select defaultValue="Lead">
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Save Client</Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-zinc-100">All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-950/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400 w-[200px]">Client / Company</TableHead>
                  <TableHead className="text-zinc-400">Contact Email</TableHead>
                  <TableHead className="text-zinc-400">Phone</TableHead>
                  <TableHead className="text-zinc-400 w-[100px]">Status</TableHead>
                  <TableHead className="text-zinc-400 text-right w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="py-3">
                      <div className="font-medium text-zinc-100">{client.name}</div>
                      <div className="text-xs text-zinc-500">{client.company}</div>
                    </TableCell>
                    <TableCell className="text-zinc-300 text-sm">{client.email}</TableCell>
                    <TableCell className="text-zinc-300 text-sm whitespace-nowrap">{client.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0 h-5",
                          client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          client.status === 'Lead' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'text-zinc-400 border-zinc-700 bg-zinc-800/50'
                        )}
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/clients/${client.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 px-2">
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
