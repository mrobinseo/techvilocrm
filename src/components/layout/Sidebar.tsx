"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  Settings, 
  ChevronRight,
  Receipt,
  Kanban,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Clients', href: '/clients', icon: Users, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Pipeline', href: '/clients/pipeline', icon: Kanban, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Projects', href: '/projects', icon: Briefcase, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Payments', href: '/payments', icon: CreditCard, roles: ['Admin', 'Manager', 'Staff'] },
    { name: 'Expenses', href: '/expenses', icon: Receipt, roles: ['Admin'] },
    { name: 'Team Settings', href: '/settings', icon: Settings, roles: ['Admin'] },
  ]

  // Ensure role exists and match exactly. Fallback to empty list if not mounted or no role.
  const userRole = currentUser?.role || ''
  const filteredNavigation = navigation.filter(item => item.roles.includes(userRole))

  if (!mounted) return (
    <div className="flex h-full w-64 shrink-0 flex-col bg-zinc-950 border-r border-zinc-800" />
  )

  return (
    <div className="flex h-full w-64 shrink-0 flex-col bg-zinc-950 border-r border-zinc-800 text-zinc-100 transition-all duration-300 relative z-40">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white text-lg">T</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">TechVilo CRM</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "size-5 transition-colors duration-200",
                    isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                  )} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="size-4 opacity-50" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-3">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 p-3">
          <div className="flex items-center gap-3 mb-3">
            <img src={currentUser?.avatar} alt="" className="size-8 rounded-full bg-zinc-800 ring-2 ring-indigo-500/20" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </div>
        
        <div className="flex items-center gap-2 px-2 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          Systems Online
        </div>
      </div>
    </div>
  )
}
