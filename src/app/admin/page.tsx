"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, Mail, ArrowRight, ShieldCheck, UserCog, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const login = useStore(state => state.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      const success = login(email, password)
      if (success) {
        router.push("/")
      } else {
        setError("Invalid email or password. Please try again.")
        setIsLoading(false)
      }
    }, 800) // Small delay for effect
  }

  const quickLogin = (e: string, p: string) => {
    setEmail(e)
    setPassword(p)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8 space-y-4">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-4 ring-zinc-900">
            <span className="text-white text-3xl font-bold">T</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">TechVilo CRM</h1>
            <p className="text-zinc-400 mt-2">Welcome back! Please login to your account.</p>
          </div>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-100">Sign In</CardTitle>
            <CardDescription className="text-zinc-400">Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="admin@techvilo.com" 
                    className="bg-zinc-950/50 border-zinc-800 pl-10 focus:ring-indigo-500/50 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-zinc-950/50 border-zinc-800 pl-10 focus:ring-indigo-500/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                  <div className="size-1.5 rounded-full bg-rose-500" />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 transition-all group"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login to Dashboard"}
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-zinc-800 pt-6 mt-2">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-zinc-950/50 border-zinc-800 text-[10px] h-auto py-2 flex flex-col gap-1 hover:bg-indigo-500/10 hover:border-indigo-500/30 group"
                onClick={() => quickLogin("admin@techvilo.com", "admin")}
              >
                <ShieldCheck className="size-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-zinc-950/50 border-zinc-800 text-[10px] h-auto py-2 flex flex-col gap-1 hover:bg-purple-500/10 hover:border-purple-500/30 group"
                onClick={() => quickLogin("manager@techvilo.com", "manager")}
              >
                <UserCog className="size-4 text-purple-400 group-hover:scale-110 transition-transform" />
                Manager
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-zinc-950/50 border-zinc-800 text-[10px] h-auto py-2 flex flex-col gap-1 hover:bg-emerald-500/10 hover:border-emerald-500/30 group"
                onClick={() => quickLogin("staff@techvilo.com", "staff")}
              >
                <User className="size-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                Staff
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-zinc-600 text-xs mt-8">
          &copy; {new Date().getFullYear()} TechVilo Solutions. All rights reserved.
        </p>
      </div>
    </div>
  )
}
