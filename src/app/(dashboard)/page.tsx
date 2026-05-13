import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Briefcase, CreditCard, Receipt, TrendingUp, Activity, Info, AlertTriangle, AlertCircle, Quote, Target, Star, Smile, Globe } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/app/actions/auth"

export default async function DashboardPage() {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  
  if (!currentUser) return null

  // Fetch all required data from Supabase
  const [
    clientsRes,
    projectsRes,
    ledgersRes,
    expensesRes,
    adSupportRes
  ] = await Promise.all([
    supabase.from('clients').select('*').order('created_at', { ascending: false }),
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('ledgers').select('*').order('created_at', { ascending: false }),
    supabase.from('expenses').select('*').order('date', { ascending: false }),
    supabase.from('ad_support').select('*').order('date', { ascending: false })
  ])

  const clients = clientsRes.data || []
  const projects = projectsRes.data || []
  const ledgers = ledgersRes.data || []
  const expenses = expensesRes.data || []
  const adSupport = adSupportRes.data || []

  const quotes = [
    "Your hard work today is building the TechVilo of tomorrow!",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Every project you finish brings us one step closer to our vision.",
    "Focus on being productive instead of busy.",
    "Small daily improvements are the key to staggering long-term results.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Don't stop when you're tired. Stop when you're done."
  ]
  const motivation = quotes[Math.floor(Math.random() * quotes.length)]

  if (currentUser.role === 'Staff') {
    // STAFF DASHBOARD VIEW - Ownership Based Filtering
    const myAllProjects = (projects || []).filter(p => p.created_by === currentUser.id)
    const myProjects = myAllProjects.filter(p => (p.status === 'Active' || p.status === 'In Progress'))
    const myCompletedProjects = myAllProjects.filter(p => p.status === 'Completed').length
    
    // Efficiency calculation
    const myEfficiency = myAllProjects.length > 0 ? `${Math.round((myCompletedProjects / myAllProjects.length) * 100)}%` : "0%"
    
    // Revenue Contribution
    const myRevenueContribution = myAllProjects.reduce((sum, p) => sum + (Number(p.paid_amount) || 0), 0)
    
    const myCostImpact = Math.round(myRevenueContribution * 0.15)
    const myNetContribution = myRevenueContribution - myCostImpact

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Welcome, {currentUser.name} <Smile className="text-yellow-400 size-6" />
            </h1>
            <p className="text-zinc-400">Here is your personal performance overview for today.</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl flex items-center gap-3 max-w-md">
            <Quote className="size-5 text-indigo-400 shrink-0" />
            <p className="text-xs italic text-indigo-300">"{motivation}"</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Target className="size-4 text-blue-400" /> My Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{myProjects.length}</div>
              <p className="text-xs text-zinc-500 mt-2">You have {myProjects.length} projects currently in progress.</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Star className="size-4 text-emerald-400" /> Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{myEfficiency}</div>
              <p className="text-xs text-zinc-500 mt-2">
                {myCompletedProjects} of {myAllProjects.length} projects completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Activity className="size-4 text-purple-400" /> Completed Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{myCompletedProjects}</div>
              <p className="text-xs text-zinc-500 mt-2">Great progress! Keep hitting those milestones.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <CardTitle className="text-zinc-100">Performance Contribution</CardTitle>
              <CardDescription className="text-zinc-400">See how your work impacts the business bottom line.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Revenue Generated</p>
                  <p className="text-2xl font-bold text-emerald-400">৳ {myRevenueContribution.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Operational Impact</p>
                  <p className="text-2xl font-bold text-orange-400">৳ {myCostImpact.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-300">Your Net Business Profit</p>
                  <p className="text-xs text-zinc-500">Based on your completed milestones.</p>
                </div>
                <div className="text-2xl font-black text-indigo-400">৳ {myNetContribution.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">My Projects</CardTitle>
              <CardDescription className="text-zinc-400">Your current assigned tasks and goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myProjects.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    No active projects assigned to you yet.
                  </div>
                ) : (
                  myProjects.map(project => {
                    const client = (clients || []).find(c => c.id === project.client_id)
                    return (
                      <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/30 hover:bg-zinc-800/50 transition-colors">
                        <div>
                          <p className="font-medium text-zinc-200">{project.name}</p>
                          <p className="text-xs text-zinc-500">{client?.company || 'N/A'}</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {project.status}
                        </Badge>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ADMIN/MANAGER DASHBOARD VIEW
  const totalRevenue = (ledgers || []).reduce((acc, curr) => acc + (Number(curr.paid_amount) || 0), 0)
  const totalExpenses = (expenses || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  const netProfit = totalRevenue - totalExpenses
  
  const totalDue = (ledgers || []).reduce((acc, curr) => acc + (Number(curr.due_amount) || 0), 0)
  const activeProjects = (projects || []).filter(p => p.status === 'Active' || p.status === 'In Progress').length
  const totalClientsCount = (clients || []).length
  const totalAdSupportBdt = (adSupport || []).reduce((acc: number, curr: any) => acc + (Number(curr.total_bdt) || 0), 0)
  const totalAdSupportUsd = (adSupport || []).reduce((acc: number, curr: any) => acc + (Number(curr.dollar_amount) || 0), 0)
  const totalAdSupportDue = (adSupport || []).reduce((acc: number, curr: any) => acc + (Number(curr.due_amount) || 0), 0)

  const pendingInvoices = (ledgers || []).filter(l => (Number(l.due_amount) || 0) > 0).length
  const activeClientCount = (clients || []).filter(c => c.status === 'Active').length

  const recentIncome = (ledgers || []).filter(l => (Number(l.paid_amount) || 0) > 0).map(l => {
    const clientName = clients?.find(c => c.id === l.client_id)?.company || 'Unknown Client'
    const project = (projects || []).find(p => p.id === l.project_id)
    return {
      id: `inc-${l.id}`,
      date: l.pay_date || l.created_at.split('T')[0],
      description: project?.name || 'Payment',
      client: clientName,
      amount: Number(l.paid_amount) || 0
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  const recentExpenses = (expenses || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0
  
  let healthTitle = ""
  let healthDescription = ""
  let AlertIcon = TrendingUp
  let alertClass = ""

  if (totalRevenue === 0 && totalExpenses === 0) {
    healthTitle = "No Financial Data Yet"
    healthDescription = "Start adding income and expenses to see your business health."
    AlertIcon = Info
    alertClass = "bg-blue-500/10 text-blue-400 border-blue-500/20"
  } else if (netProfit < 0) {
    healthTitle = "Critical: Operating at a Loss"
    healthDescription = `Your expenses exceed your revenue by ৳ ${Math.abs(netProfit).toLocaleString()}. Focus on collecting the ৳ ${totalDue.toLocaleString()} in due payments.`
    AlertIcon = AlertTriangle
    alertClass = "bg-rose-500/10 text-rose-400 border-rose-500/20"
  } else if (netProfit > 0 && Number(profitMargin) < 20) {
    healthTitle = "Warning: Low Profit Margin"
    healthDescription = `You are profitable, but your margin is only ${profitMargin}%. Try to optimize your operational expenses.`
    AlertIcon = AlertCircle
    alertClass = "bg-amber-500/10 text-amber-400 border-amber-500/20"
  } else {
    healthTitle = "Excellent: Healthy Business"
    healthDescription = `Your business is operating with a solid ${profitMargin}% profit margin. Keep up the great work!`
    AlertIcon = TrendingUp
    alertClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
          <p className="text-zinc-400">Here's what's happening with TechVilo CRM today.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-lg">
          <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {currentUser?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">{currentUser?.name}</p>
            <p className="text-[10px] text-zinc-500 leading-tight capitalize">{currentUser?.role} Account</p>
          </div>
        </div>
      </div>

      <div className={`flex items-start gap-3 p-4 rounded-lg border ${alertClass}`}>
        <AlertIcon className="size-5 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-semibold">{healthTitle}</h3>
          <p className="text-sm opacity-90 mt-1">{healthDescription}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Total Revenue</CardTitle>
            <div className="size-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">৳ {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="size-3" />
              All time gross income
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Total Expenses</CardTitle>
            <div className="size-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <Receipt className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">৳ {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-orange-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowDownRight className="size-3" />
              All time operational costs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Net Profit</CardTitle>
            <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>৳ {netProfit.toLocaleString()}</div>
            <p className={`text-xs flex items-center gap-1 mt-1 font-medium ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netProfit >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Number(profitMargin) > 0 ? `${profitMargin}% margin` : 'Net profitability'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Due Amount</CardTitle>
            <div className="size-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">৳ {totalDue.toLocaleString()}</div>
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowDownRight className="size-3" />
              {pendingInvoices} invoices pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Active Projects</CardTitle>
            <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Briefcase className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">{activeProjects}</div>
            <p className="text-xs text-zinc-500 mt-1">
              {projects.filter(p => p.status === 'Completed').length} completed total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Total Clients</CardTitle>
            <div className="size-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">{totalClientsCount}</div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="size-3" />
              {activeClientCount} active clients
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Ads Support</CardTitle>
            <div className="size-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Globe className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">$ {totalAdSupportUsd.toLocaleString()}</div>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-xs text-cyan-400 flex items-center gap-1 font-medium">
                <ArrowUpRight className="size-3" />
                ৳ {totalAdSupportBdt.toLocaleString()} Volume
              </p>
              {totalAdSupportDue > 0 && (
                <p className="text-[10px] text-rose-400 flex items-center gap-1 font-bold">
                  <AlertCircle className="size-3" />
                  ৳ {totalAdSupportDue.toLocaleString()} Due
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-start">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                <TrendingUp className="size-5 text-emerald-400" />
                Recent Income
              </CardTitle>
              <CardDescription className="text-zinc-400">Latest payments received from clients.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-zinc-400">Description</TableHead>
                    <TableHead className="text-zinc-400">Client</TableHead>
                    <TableHead className="text-zinc-400 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentIncome.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-zinc-500 py-6">No income recorded yet.</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {recentIncome.map((item) => (
                        <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                          <TableCell className="text-zinc-400">{formatDate(item.date)}</TableCell>
                          <TableCell className="font-medium text-zinc-100">{item.description}</TableCell>
                          <TableCell className="text-zinc-300">{item.client}</TableCell>
                          <TableCell className="text-right font-medium text-emerald-400">
                            + ৳ {item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                <Receipt className="size-5 text-orange-400" />
                Recent Expenses
              </CardTitle>
              <CardDescription className="text-zinc-400">Latest operational costs and bills.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-zinc-400">Description</TableHead>
                    <TableHead className="text-zinc-400">Category</TableHead>
                    <TableHead className="text-zinc-400 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-zinc-500 py-6">No expenses recorded yet.</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {recentExpenses.map((expense) => (
                        <TableRow key={expense.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                          <TableCell className="text-zinc-400">{formatDate(expense.date)}</TableCell>
                          <TableCell className="font-medium text-zinc-100">{expense.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-zinc-800/50 text-zinc-300 border-zinc-700">
                              {expense.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-orange-400">
                            - ৳ {Number(expense.amount).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
