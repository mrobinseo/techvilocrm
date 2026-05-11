"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, UserPlus, Shield, UserCog, User, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { users, currentUser, addUser, updateUserRole } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="size-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
            <Shield className="size-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-zinc-400 max-w-xs">You do not have permission to access the team management settings.</p>
        </div>
      </div>
    )
  }

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string
    
    addUser({
      id: Math.random().toString(),
      name,
      email,
      password: role.toLowerCase(), // Default password is the role name
      role: role as any,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Team Settings</h1>
          <p className="text-zinc-400">Manage your team members and their access levels.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
              <UserPlus className="size-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Create a new user account and assign a role.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                  <Input name="name" id="name" placeholder="e.g. Arif Ahmed" className="bg-zinc-900 border-zinc-800 text-zinc-100" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                  <Input name="email" id="email" type="email" placeholder="arif@techvilo.com" className="bg-zinc-900 border-zinc-800 text-zinc-100" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-zinc-300">Access Role</Label>
                  <Select name="role" defaultValue="Staff">
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                      <SelectItem value="Manager">Manager (Business Access)</SelectItem>
                      <SelectItem value="Staff">Staff (Personal KPI Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white w-full">Create Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">All Team Members</CardTitle>
            <CardDescription className="text-zinc-400">List of active users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">User</TableHead>
                    <TableHead className="text-zinc-400">Role</TableHead>
                    <TableHead className="text-zinc-400">Email</TableHead>
                    <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                      <TableCell className="font-medium text-zinc-100">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="size-8 rounded-full bg-zinc-800" />
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          user.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                          user.role === 'Manager' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">{user.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white hover:bg-zinc-800">
                            <UserCog className="size-4" />
                          </Button>
                          {user.id !== currentUser.id && (
                            <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10">
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Access Level Reference Card */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Shield className="size-5" /> Admin
            </div>
            <p className="text-xs text-zinc-400">Full access to all modules including finance, settings, and user management.</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <UserCog className="size-5" /> Manager
            </div>
            <p className="text-xs text-zinc-400">Access to global dashboard and client data. Cannot manage other users.</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 font-bold">
              <User className="size-5" /> Staff
            </div>
            <p className="text-xs text-zinc-400">Limited to personal KPI dashboard and their assigned projects. No global finance visibility.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
