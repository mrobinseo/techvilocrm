"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { useStore } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentUser } = useStore()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !currentUser) {
      router.push("/admin")
    }
  }, [currentUser, router, isMounted])

  if (!isMounted || !currentUser) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-xl bg-indigo-600 animate-pulse" />
          <p className="text-zinc-500 text-sm animate-pulse">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 selection:bg-indigo-500/30">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950/50 p-6">
          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
