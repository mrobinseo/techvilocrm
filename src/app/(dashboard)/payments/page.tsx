"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Download, FileSpreadsheet, Building2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function LedgerPage() {
  const { clients, ledgers, addLedgerEntry, currentUser } = useStore()
  
  const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager'

  // Ownership Filtering
  const filteredClients = isAdminOrManager 
    ? clients 
    : clients.filter(c => (c as any).createdBy === currentUser?.id)

  const activeClients = filteredClients.filter(c => c.status === 'Active' || c.status === 'Lead')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(activeClients.length > 0 ? activeClients[0].id : null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const selectedClient = clients.find(c => c.id === selectedClientId)
  const clientLedger = ledgers.filter(l => l.clientId === selectedClientId)

  const handleRecordEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const total = Number(formData.get("totalAmount")) || 0
    const paid = Number(formData.get("paidAmount")) || 0
    const advanced = Number(formData.get("advancedAmount")) || 0
    const due = total - paid
    
    const newEntry = {
      id: Math.random().toString(),
      clientId: selectedClientId!,
      project: (formData.get("project") as string) || "General Service",
      totalAmount: total,
      paidAmount: paid,
      dueAmount: due,
      payDate: (formData.get("payDate") as string) || new Date().toISOString().split('T')[0],
      advancedAmount: advanced,
      nextPaymentDate: (formData.get("nextPaymentDate") as string) || "",
      paymentMonth: (formData.get("paymentMonth") as string) || "Current",
      fullAmount: formData.get("fullAmount") as string,
      status: due === 0 ? "Paid" : due < total && paid > 0 ? "Partial" : "Unpaid"
    }
    
    addLedgerEntry(newEntry)
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Client Ledgers</h1>
          <p className="text-zinc-400">Detailed month-by-month billing and payment history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2">
            <Download className="size-4" />
            Export Excel
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedClientId} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Plus className="size-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
              <form onSubmit={handleRecordEntry}>
                <DialogHeader>
                  <DialogTitle>Add Ledger Entry</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Add a new billing row for {selectedClient?.company || 'Client'}.
                  </DialogDescription>
                </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-300">Project / Service</Label>
                  <Input name="project" placeholder="e.g. SEO Campaign" className="bg-zinc-900 border-zinc-800" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Total Amount</Label>
                    <Input name="totalAmount" type="number" defaultValue="0" className="bg-zinc-900 border-zinc-800" required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Paid Amount</Label>
                    <Input name="paidAmount" type="number" defaultValue="0" className="bg-zinc-900 border-zinc-800" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Pay Date</Label>
                    <Input name="payDate" type="date" className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Next Payment Date</Label>
                    <Input name="nextPaymentDate" type="date" className="bg-zinc-900 border-zinc-800" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-300">Advanced Amount (if any)</Label>
                  <Input name="advancedAmount" type="number" defaultValue="0" className="bg-zinc-900 border-zinc-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Billing Month</Label>
                    <Input name="paymentMonth" placeholder="e.g. February 2026" className="bg-zinc-900 border-zinc-800" required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Full Amount Received?</Label>
                    <Select defaultValue="Yes" name="fullAmount">
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Save Entry</Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar: Client List Tabs */}
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
              <Building2 className="size-4" /> Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {activeClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors",
                    selectedClientId === client.id 
                      ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20" 
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent"
                  )}
                >
                  <div className="truncate">{client.company}</div>
                  <div className="text-xs opacity-70 truncate">{client.name}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Area: Ledger Table */}
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-indigo-400" />
              {selectedClient ? `${selectedClient.company} - Ledger` : "Select a client"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Detailed tracking for {selectedClient?.name || 'this client'}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientLedger.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No ledger entries found for this client. Click "Add Entry" to create one.
              </div>
            ) : (
              <div className="rounded-md border border-zinc-800 overflow-x-auto">
                <Table className="min-w-[1000px]">
                  <TableHeader className="bg-zinc-950/50">
                    <TableRow className="border-zinc-800 hover:bg-transparent whitespace-nowrap">
                      <TableHead className="text-zinc-400">Project/Service</TableHead>
                      <TableHead className="text-zinc-400">Billing Month</TableHead>
                      <TableHead className="text-zinc-400 text-right">Total Amount</TableHead>
                      <TableHead className="text-zinc-400 text-right">Paid</TableHead>
                      <TableHead className="text-zinc-400 text-right">Due</TableHead>
                      <TableHead className="text-zinc-400">Pay Date</TableHead>
                      <TableHead className="text-zinc-400">Next Payment</TableHead>
                      <TableHead className="text-zinc-400 text-center">Full Amount?</TableHead>
                      <TableHead className="text-zinc-400 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientLedger.map((entry) => (
                      <TableRow key={entry.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors whitespace-nowrap">
                        <TableCell className="font-medium text-zinc-100">{entry.project}</TableCell>
                        <TableCell className="text-zinc-300">{entry.paymentMonth}</TableCell>
                        <TableCell className="text-right text-zinc-300">৳ {entry.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-emerald-400 font-medium">৳ {entry.paidAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-rose-400 font-medium">
                          {entry.dueAmount > 0 ? `৳ ${entry.dueAmount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="text-zinc-400">{entry.payDate || '-'}</TableCell>
                        <TableCell className="text-zinc-400">{entry.nextPaymentDate || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={entry.fullAmount === 'Yes' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}>
                            {entry.fullAmount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline"
                            className={
                              entry.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              entry.status === 'Partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow className="border-zinc-800 bg-zinc-950/80 font-bold hover:bg-zinc-950/80">
                      <TableCell colSpan={2} className="text-zinc-100">Total Calculation</TableCell>
                      <TableCell className="text-right text-zinc-100">
                        ৳ {clientLedger.reduce((sum, e) => sum + e.totalAmount, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-emerald-400">
                        ৳ {clientLedger.reduce((sum, e) => sum + e.paidAmount, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-rose-400">
                        ৳ {clientLedger.reduce((sum, e) => sum + e.dueAmount, 0).toLocaleString()}
                      </TableCell>
                      <TableCell colSpan={4}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
