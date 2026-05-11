"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Download, Receipt } from "lucide-react"
import { useStore } from "@/lib/store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExpensesPage() {
  const { expenses, addExpense, currentUser } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (currentUser?.role === 'Staff') {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-zinc-400">Staff members do not have access to company expense reports.</p>
        </div>
      </div>
    )
  }

  const handleRecordExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newExpense = {
      id: Math.random().toString(),
      title: (formData.get("title") as string) || "General Expense",
      category: (formData.get("category") as string) || "Other",
      amount: Number(formData.get("amount")) || 0,
      date: new Date().toISOString().split('T')[0],
      reference: (formData.get("reference") as string) || "-",
    }
    addExpense(newExpense)
    setIsDialogOpen(false)
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Expenses</h1>
          <p className="text-zinc-400">Track internal costs and operational expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2">
            <Download className="size-4" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2" />}>
              <Plus className="size-4" />
              Record Expense
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
              <form onSubmit={handleRecordExpense}>
                <DialogHeader>
                  <DialogTitle>Record New Expense</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Log an internal cost or operational expense.
                  </DialogDescription>
                </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-zinc-300">Expense Title</Label>
                  <Input name="title" id="title" placeholder="e.g. Office Rent, Employee Salary" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-zinc-300">Category</Label>
                  <Select defaultValue="Marketing">
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Software/IT">Software/IT</SelectItem>
                      <SelectItem value="Marketing">Marketing & Ads</SelectItem>
                      <SelectItem value="Payroll">Payroll</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-zinc-300">Amount (BDT)</Label>
                  <Input name="amount" id="amount" type="number" placeholder="10000" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reference" className="text-zinc-300">Reference / Note</Label>
                  <Input name="reference" id="reference" placeholder="e.g. April Bill" className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500/50" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Save Expense</Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Total Expenses</CardTitle>
            <Receipt className="size-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">৳ {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-zinc-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Expense History</CardTitle>
          <CardDescription className="text-zinc-400">Recent internal costs and operational expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-950/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Date</TableHead>
                  <TableHead className="text-zinc-400">Title</TableHead>
                  <TableHead className="text-zinc-400">Category</TableHead>
                  <TableHead className="text-zinc-400">Reference</TableHead>
                  <TableHead className="text-zinc-400 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="text-zinc-300">{expense.date}</TableCell>
                    <TableCell className="font-medium text-zinc-100">{expense.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-zinc-800/50 text-zinc-300 border-zinc-700">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">{expense.reference}</TableCell>
                    <TableCell className="text-right font-medium text-rose-400">
                      - ৳ {expense.amount.toLocaleString()}
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
