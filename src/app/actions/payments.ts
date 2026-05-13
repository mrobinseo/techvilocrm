"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const paymentSchema = z.object({
  projectId: z.string().uuid(),
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  method: z.string().min(1, "Payment method is required"),
  payDate: z.string().min(1, "Payment date is required"),
  billingMonth: z.string().min(1, "Billing period is required"),
  nextPaymentDate: z.string().optional().nullable(),
})

export async function recordPayment(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const validatedData = paymentSchema.parse({
      projectId: formData.get("projectId"),
      amount: formData.get("amount"),
      method: formData.get("method"),
      payDate: formData.get("payDate"),
      billingMonth: formData.get("billingMonth"),
      nextPaymentDate: formData.get("nextPaymentDate") || null,
    })

    // 1. Fetch project
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('*')
      .eq('id', validatedData.projectId)
      .single()

    if (projErr || !project) throw new Error("Project not found")

    const actualAmount = Math.min(validatedData.amount, project.due_amount)
    if (actualAmount <= 0) return { success: false, error: "Due amount is already zero" }

    const newPaid = project.paid_amount + actualAmount
    const newDue = project.amount - newPaid
    const isFullyPaid = newDue <= 0
    const newStatus = isFullyPaid ? 'Completed' : project.status

    // 2. Insert Payment Log
    const { error: payErr } = await supabase.from('payments').insert({
      project_id: validatedData.projectId,
      amount: actualAmount,
      method: validatedData.method,
      date: validatedData.payDate,
      billing_period: validatedData.billingMonth,
      created_by: user.id
    })
    if (payErr) throw payErr

    // 3. Insert Ledger Entry
    const { error: ledgErr } = await supabase.from('ledgers').insert({
      client_id: project.client_id,
      project_id: validatedData.projectId,
      total_amount: project.amount,
      paid_amount: actualAmount,
      due_amount: newDue > 0 ? newDue : 0,
      status: isFullyPaid ? 'Paid' : 'Partial',
      pay_date: validatedData.payDate,
      next_payment_date: isFullyPaid ? null : validatedData.nextPaymentDate,
      payment_month: validatedData.billingMonth,
      full_amount: isFullyPaid ? 'Yes' : 'No',
      created_by: user.id
    })
    if (ledgErr) throw ledgErr

    // 4. Update Project
    const { error: pUpdateErr } = await supabase.from('projects').update({
      paid_amount: newPaid,
      due_amount: newDue > 0 ? newDue : 0,
      status: newStatus,
      next_payment_date: isFullyPaid ? null : (validatedData.nextPaymentDate || project.next_payment_date)
    }).eq('id', validatedData.projectId)
    
    if (pUpdateErr) throw pUpdateErr

    revalidatePath("/payments")
    revalidatePath("/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to record payment:", error)
    return { success: false, error: error.message || "Failed to record payment" }
  }
}

export async function updatePayment(ledgerId: string, formData: FormData) {
  try {
    const supabase = await createClient()

    const amount = Number(formData.get("amount")) || 0
    const billingMonth = (formData.get("billingMonth") as string) || null
    const payDate = (formData.get("payDate") as string) || null
    const nextPaymentDate = (formData.get("nextPaymentDate") as string) || null

    // 1. Fetch old ledger entry
    const { data: oldLedger } = await supabase.from('ledgers').select('*').eq('id', ledgerId).single()
    if (!oldLedger) throw new Error("Ledger not found")

    // 2. Fetch project
    const { data: project } = await supabase.from('projects').select('*').eq('id', oldLedger.project_id).single()
    if (!project) throw new Error("Project not found")

    // 3. Recalculate
    const amountDiff = amount - oldLedger.paid_amount
    const newPaid = project.paid_amount + amountDiff
    const newDue = project.amount - newPaid
    const isFullyPaid = newDue <= 0
    const newStatus = isFullyPaid ? 'Completed' : (project.status === 'Completed' ? 'Active' : project.status)

    // 4. Update ledger
    const { error: ledgErr } = await supabase.from('ledgers').update({
      paid_amount: amount,
      due_amount: newDue > 0 ? newDue : 0,
      status: isFullyPaid ? 'Paid' : 'Partial',
      payment_month: billingMonth || oldLedger.payment_month,
      pay_date: payDate || oldLedger.pay_date,
      next_payment_date: isFullyPaid ? null : (nextPaymentDate || oldLedger.next_payment_date),
      full_amount: isFullyPaid ? 'Yes' : 'No',
    }).eq('id', ledgerId)
    if (ledgErr) throw ledgErr

    // 5. Update project
    const { error: pUpdateErr } = await supabase.from('projects').update({
      paid_amount: newPaid,
      due_amount: newDue > 0 ? newDue : 0,
      status: newStatus,
      next_payment_date: isFullyPaid ? null : (nextPaymentDate || project.next_payment_date)
    }).eq('id', project.id)
    if (pUpdateErr) throw pUpdateErr

    revalidatePath("/payments")
    revalidatePath("/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update payment:", error)
    return { success: false, error: error.message || "Failed to update payment" }
  }
}

export async function deletePayment(ledgerId: string) {
  try {
    const supabase = await createClient()

    const { data: ledger } = await supabase.from('ledgers').select('*').eq('id', ledgerId).single()
    if (!ledger) return { success: false, error: "Ledger not found" }

    const { data: project } = await supabase.from('projects').select('*').eq('id', ledger.project_id).single()
    if (project) {
      const newPaid = Math.max(0, project.paid_amount - ledger.paid_amount)
      const newDue = project.amount - newPaid
      let newStatus = project.status
      if (project.status === 'Completed' && newDue > 0) newStatus = 'Active'

      await supabase.from('projects').update({
        paid_amount: newPaid,
        due_amount: newDue,
        status: newStatus
      }).eq('id', project.id)
    }

    // Delete payment log (soft match by amount/date/project)
    await supabase.from('payments').delete()
      .eq('project_id', ledger.project_id)
      .eq('amount', ledger.paid_amount)
      .eq('date', ledger.pay_date)

    // Delete ledger
    await supabase.from('ledgers').delete().eq('id', ledgerId)

    revalidatePath("/payments")
    revalidatePath("/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete payment:", error)
    return { success: false, error: error.message || "Failed to delete payment" }
  }
}
