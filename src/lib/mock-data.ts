export const mockClients = [
  { id: '1', name: 'Rahim Uddin', company: 'Kayvo', phone: '+880 171 1234567', email: 'contact@kayvo.com', status: 'Active', createdBy: 'u1' },
  { id: '2', name: 'John Doe', company: 'Acme Corp', phone: '+1 234 567 890', email: 'john@acme.com', status: 'Active', createdBy: 'u1' },
  { id: '3', name: 'Jane Smith', company: 'Globex Inc', phone: '+1 987 654 321', email: 'jane@globex.com', status: 'Lead', createdBy: 'u3' },
]

export const mockProjects = [
  { id: '1', name: 'Digital Marketing & Ads', client: 'Kayvo', service: 'Digital Marketing', status: 'Active', billingType: 'Recurring (Monthly)', amount: 40000, paidAmount: 20000, dueAmount: 20000, nextPaymentDate: '2026-06-10', createdBy: 'u1' },
  { id: '2', name: 'E-Commerce Website', client: 'Acme Corp', service: 'Web Dev', status: 'In Progress', billingType: 'One-time', amount: 150000, paidAmount: 50000, dueAmount: 100000, nextPaymentDate: '2026-05-20', createdBy: 'u1' },
  { id: '3', name: 'AI Chatbot Integration', client: 'Globex Inc', service: 'AI Agent', status: 'Completed', billingType: 'One-time', amount: 80000, paidAmount: 80000, dueAmount: 0, nextPaymentDate: null, createdBy: 'u3' },
]

export const mockPayments = [
  { id: '1', project: 'Digital Marketing & Ads', client: 'Kayvo', amount: 40000, date: '2026-05-10', method: 'bKash / Bank', status: 'Completed', billingPeriod: 'May 2026' },
  { id: '2', project: 'Digital Marketing & Ads', client: 'Kayvo', amount: 40000, date: '2026-04-10', method: 'bKash / Bank', status: 'Completed', billingPeriod: 'April 2026' },
  { id: '3', project: 'E-Commerce Website', client: 'Acme Corp', amount: 50000, date: '2026-05-01', method: 'Bank Transfer', status: 'Completed', billingPeriod: 'Advance Payment' },
]

export const mockExpenses = [
  { id: '1', title: 'Office Rent', category: 'Rent', amount: 15000, date: '2026-05-05', reference: 'May Rent' },
  { id: '2', title: 'Server Hosting (Vercel & Supabase)', category: 'Software/IT', amount: 5000, date: '2026-05-02', reference: 'Cloud Services' },
  { id: '3', title: 'Facebook Ads', category: 'Marketing', amount: 10000, date: '2026-05-08', reference: 'Kayvo Campaign Ad Spend' },
]

export const mockLedgers = [
  { 
    id: '1', 
    clientId: '1', // Rahim Uddin (Kayvo)
    project: 'Digital Marketing & Ads',
    totalAmount: 40000,
    paidAmount: 20000,
    dueAmount: 20000,
    payDate: '2026-05-02',
    advancedAmount: 0,
    nextPaymentDate: '2026-06-02',
    paymentMonth: 'May',
    fullAmount: 'No',
    status: 'Unpaid',
    createdBy: 'u1'
  },
  { 
    id: '2', 
    clientId: '2', // John Doe (Acme Corp)
    project: 'E-Commerce Website',
    totalAmount: 150000,
    paidAmount: 50000,
    dueAmount: 100000,
    payDate: '2026-04-15',
    advancedAmount: 50000,
    nextPaymentDate: '2026-05-15',
    paymentMonth: 'April',
    fullAmount: 'No',
    status: 'Partial',
    createdBy: 'u1'
  }
]

export const mockUsers = [
  { id: 'u1', name: 'Super Admin', email: 'admin@techvilo.com', password: 'admin', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
  { id: 'u2', name: 'Business Manager', email: 'manager@techvilo.com', password: 'manager', role: 'Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager' },
  { id: 'u3', name: 'Sales Associate', email: 'staff@techvilo.com', password: 'staff', role: 'Staff', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff' },
]
