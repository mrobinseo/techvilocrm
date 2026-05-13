"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Mail, User as UserIcon, CheckCircle2 } from "lucide-react"
import { updatePassword } from "@/app/actions/users"

export function ProfileClient({ currentUser }: { currentUser: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    try {
      await updatePassword(formData)
      setSuccess(true)
      e.currentTarget.reset()
    } catch (err) {
      setError((err as any).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="text-zinc-400">Manage your personal account settings.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Account Information</CardTitle>
          <CardDescription className="text-zinc-400">Basic details about your account (Read-only).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-500 flex items-center gap-2">
                <UserIcon className="size-3.5" /> Full Name
              </Label>
              <div className="p-2.5 bg-zinc-950/50 border border-zinc-800 rounded-md text-zinc-300">
                {currentUser.name}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-500 flex items-center gap-2">
                <Shield className="size-3.5" /> Access Role
              </Label>
              <div className="flex">
                <Badge variant="outline" className={
                  currentUser.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  currentUser.role === 'Manager' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                }>
                  {currentUser.role}
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-500 flex items-center gap-2">
              <Mail className="size-3.5" /> Email Address
            </Label>
            <div className="p-2.5 bg-zinc-950/50 border border-zinc-800 rounded-md text-zinc-300">
              {currentUser.email}
            </div>
            <p className="text-[10px] text-zinc-600 italic">Contact admin to change your email or name.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Update Password</CardTitle>
          <CardDescription className="text-zinc-400">Change your login password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-zinc-300">New Password</Label>
              <Input 
                name="password" 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-zinc-950 border-zinc-800 text-white" 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm New Password</Label>
              <Input 
                name="confirmPassword" 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                className="bg-zinc-950 border-zinc-800 text-white" 
                required 
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Password updated successfully!
              </div>
            )}

            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2" disabled={isLoading}>
              <Lock className="size-4" />
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
