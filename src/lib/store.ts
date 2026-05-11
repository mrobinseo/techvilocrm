import { create } from 'zustand'
import { mockClients, mockProjects, mockPayments, mockExpenses, mockLedgers, mockUsers } from './mock-data'

export type Client = typeof mockClients[0]
export type Project = typeof mockProjects[0]
export type Payment = typeof mockPayments[0]
export type Expense = typeof mockExpenses[0]
export type LedgerEntry = typeof mockLedgers[0]
export type User = typeof mockUsers[0]

interface CRMStore {
  clients: Client[]
  projects: Project[]
  payments: Payment[]
  expenses: Expense[]
  ledgers: LedgerEntry[]
  users: User[]
  currentUser: User | null
  
  addClient: (client: Client) => void
  updateClientStatus: (clientId: string, status: string) => void
  addProject: (project: Project) => void
  addPayment: (payment: Payment) => void
  addPartialPayment: (projectId: string, amount: number) => void
  addExpense: (expense: Expense) => void
  addLedgerEntry: (entry: LedgerEntry) => void
  
  // Auth & User Actions
  login: (email: string, password: string) => boolean
  logout: () => void
  addUser: (user: User) => void
  updateUserRole: (userId: string, role: string) => void
}

export const useStore = create<CRMStore>((set, get) => ({
  clients: mockClients,
  projects: mockProjects,
  payments: mockPayments,
  expenses: mockExpenses,
  ledgers: mockLedgers,
  users: mockUsers,
  currentUser: null, // Initially not logged in

  addClient: (client) => set((state) => ({ 
    clients: [{ ...client, createdBy: state.currentUser?.id || 'u1' }, ...state.clients] 
  })),
  
  updateClientStatus: (clientId, status) => set((state) => ({
    clients: state.clients.map(c => c.id === clientId ? { ...c, status } : c)
  })),
  
  addProject: (project) => set((state) => ({ 
    projects: [{ ...project, createdBy: state.currentUser?.id || 'u1' }, ...state.projects] 
  })),

  addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),

  addLedgerEntry: (entry) => set((state) => ({ 
    ledgers: [{ ...entry, createdBy: state.currentUser?.id || 'u1' }, ...state.ledgers] 
  })),
  
  addPayment: (payment) => set((state) => {
    const updatedProjects = state.projects.map(p => {
      if (p.name === payment.project) {
        const newPaid = p.paidAmount + payment.amount
        const newDue = p.amount - newPaid
        return { ...p, paidAmount: newPaid, dueAmount: newDue > 0 ? newDue : 0 }
      }
      return p
    })
    
    return {
      payments: [payment, ...state.payments],
      projects: updatedProjects
    }
  }),

  addPartialPayment: (projectId, amount) => set((state) => {
    const project = state.projects.find(p => p.id === projectId)
    
    const updatedProjects = state.projects.map(p => {
      if (p.id === projectId) {
        const newPaid = p.paidAmount + amount
        const newDue = p.amount - newPaid
        return { ...p, paidAmount: newPaid, dueAmount: newDue > 0 ? newDue : 0 }
      }
      return p
    })

    const newLedgerEntry = {
      id: Math.random().toString(),
      clientId: state.clients.find(c => c.company === project?.client || c.name === project?.client)?.id || 'unknown',
      project: project?.name || 'Unknown Project',
      totalAmount: amount,
      paidAmount: amount,
      dueAmount: 0,
      payDate: new Date().toISOString().split('T')[0],
      advancedAmount: 0,
      nextPaymentDate: '',
      paymentMonth: 'Quick Payment',
      fullAmount: 'Yes',
      status: 'Paid'
    }

    return {
      ledgers: [{ ...newLedgerEntry, createdBy: state.currentUser?.id || 'u1' }, ...state.ledgers],
      projects: updatedProjects
    }
  }),

  // Auth & User Actions
  login: (email, password) => {
    const user = get().users.find(u => u.email === email && u.password === password)
    if (user) {
      set({ currentUser: user })
      return true
    }
    return false
  },
  logout: () => set({ currentUser: null }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUserRole: (userId, role) => set((state) => ({
    users: state.users.map(u => u.id === userId ? { ...u, role } : u) as User[]
  }))
}))
