"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, Phone, GripVertical, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateClientStatus } from "@/app/actions/clients"
import { toast } from "sonner"

export function PipelineClient({ initialClients, currentUser, users }: { initialClients: any[], currentUser: any, users: any[] }) {
  const router = useRouter()
  
  const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager'
  const isStaff = currentUser?.role === 'Staff'
  
  const clients = initialClients

  const isOwnClient = (client: any) => client.created_by === currentUser?.id
  const getOwnerName = (entity: any) => {
    const owner = users.find(u => u.id === entity.created_by)
    return owner?.name || 'Unknown'
  }

  const leads = clients.filter(c => c.status === 'Lead')
  const active = clients.filter(c => c.status === 'Active')
  const inactive = clients.filter(c => c.status === 'Inactive')

  const moveStatus = async (clientId: string, newStatus: string) => {
    const client = clients.find(c => c.id === clientId)
    if (!client) return
    if (isStaff && !isOwnClient(client)) {
      toast.error("Access denied: This is not your client.")
      return
    }
    
    try {
      const result = await updateClientStatus(clientId, newStatus)
      if (result.success) {
        toast.success(`Moved to ${newStatus}`)
      } else {
        toast.error(result.error || "Failed to update status")
      }
    } catch (error) {
      toast.error("Failed to update status")
      console.error("Failed to update status:", error)
    }
  }

  const handleDragStart = (e: React.DragEvent, clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    if (isStaff && !isOwnClient(client)) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData("clientId", clientId)
    e.currentTarget.classList.add("opacity-50")
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const clientId = e.dataTransfer.getData("clientId")
    if (clientId) {
      moveStatus(clientId, newStatus)
    }
  }

  const KanbanCard = ({ client, colorClass }: { client: any, colorClass: string }) => {
    const isMine = isOwnClient(client)
    const canDrag = isAdminOrManager || isMine
    return (
    <Card 
      draggable={canDrag}
      onDragStart={(e) => handleDragStart(e, client.id)}
      onDragEnd={handleDragEnd}
      className={`bg-zinc-900 border-zinc-800 border-l-4 ${colorClass} shadow-md transition-colors group ${
        canDrag 
          ? 'cursor-grab active:cursor-grabbing hover:bg-zinc-800/50' 
          : 'cursor-default opacity-50'
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-1.5">
          <div className="font-semibold text-zinc-100 text-sm truncate pr-2">
            {client.name}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isStaff && (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-[9px] font-medium px-1 rounded",
                  isMine ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800/50 text-zinc-500"
                )}>
                  {getOwnerName(client)}
                </span>
                {!isMine && <Lock className="size-3 text-zinc-600" />}
              </div>
            )}
            {canDrag && <GripVertical className="size-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
        </div>
        
        <div className="text-xs text-zinc-400 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 truncate">
            <User className="size-3 shrink-0" />
            <span className="truncate">{client.company}</span>
          </div>
          {client.status === 'Lead' && (
            <>
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="size-3 shrink-0" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )}

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center gap-4 shrink-0">
        <Button onClick={() => router.push('/clients')} variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Lead Pipeline</h1>
          <p className="text-zinc-400">
            {isStaff 
              ? "View all clients. Drag your own clients to update their status." 
              : "Drag and drop clients to update their status."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 flex-1 min-h-0 overflow-hidden">
        <div 
          className="flex flex-col gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Lead')}
        >
          <div className="flex items-center justify-between px-1 shrink-0">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500"></span>
              Leads
            </h2>
            <span className="text-xs font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{leads.length}</span>
          </div>
          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar pb-10">
            {leads.map(client => (
              <KanbanCard key={client.id} client={client} colorClass="border-l-blue-500" />
            ))}
            {leads.length === 0 && (
              <div className="h-24 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
                Drop leads here
              </div>
            )}
          </div>
        </div>

        <div 
          className="flex flex-col gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Active')}
        >
          <div className="flex items-center justify-between px-1 shrink-0">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              Active
            </h2>
            <span className="text-xs font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{active.length}</span>
          </div>
          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar pb-10">
            {active.map(client => (
              <KanbanCard key={client.id} client={client} colorClass="border-l-emerald-500" />
            ))}
            {active.length === 0 && (
              <div className="h-24 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
                Drop active clients here
              </div>
            )}
          </div>
        </div>

        <div 
          className="flex flex-col gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Inactive')}
        >
          <div className="flex items-center justify-between px-1 shrink-0">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span className="size-2 rounded-full bg-zinc-600"></span>
              Inactive / Archived
            </h2>
            <span className="text-xs font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{inactive.length}</span>
          </div>
          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar pb-10">
            {inactive.map(client => (
              <KanbanCard key={client.id} client={client} colorClass="border-l-zinc-600" />
            ))}
            {inactive.length === 0 && (
              <div className="h-24 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
                Drop archived clients here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
