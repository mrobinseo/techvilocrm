"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const adSupportSchema = z.object({
  clientId: z.string().uuid(),
  dollarAmount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  rate: z.coerce.number().min(1, "Rate must be at least 1"),
  paidAmount: z.coerce.number().min(0).default(0),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  nextPaymentDate: z.string().optional().nullable(),
})

export async function recordAdSupport(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const validatedData = adSupportSchema.parse({
      clientId: formData.get("clientId"),
      dollarAmount: formData.get("dollarAmount"),
      rate: formData.get("rate"),
      paidAmount: formData.get("paidAmount") || 0,
      description: formData.get("description"),
      date: formData.get("date"),
      nextPaymentDate: formData.get("nextPaymentDate") || null,
    })

    const totalBdt = validatedData.dollarAmount * validatedData.rate
    const dueAmount = totalBdt - validatedData.paidAmount

    const { error } = await supabase.from('ad_support').insert({
      client_id: validatedData.clientId,
      dollar_amount: validatedData.dollarAmount,
      rate: validatedData.rate,
      total_bdt: totalBdt,
      paid_amount: validatedData.paidAmount,
      due_amount: dueAmount,
      next_payment_date: validatedData.nextPaymentDate,
      description: validatedData.description,
      date: validatedData.date,
      created_by: user.id
    })

    if (error) throw error

    revalidatePath("/ad-support")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to record ad support:", error)
    return { success: false, error: error.message || "Failed to record ad support" }
  }
}

export async function updateAdSupport(id: string, formData: FormData) {
  try {
    const supabase = await createClient()
    
    const dollarAmount = Number(formData.get("dollarAmount"))
    const rate = Number(formData.get("rate"))
    const paidAmount = Number(formData.get("paidAmount")) || 0
    const nextPaymentDate = formData.get("nextPaymentDate") as string || null
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const clientId = formData.get("clientId") as string

    const totalBdt = dollarAmount * rate
    const dueAmount = totalBdt - paidAmount

    const { error } = await supabase.from('ad_support').update({
      client_id: clientId,
      dollar_amount: dollarAmount,
      rate: rate,
      total_bdt: totalBdt,
      paid_amount: paidAmount,
      due_amount: dueAmount,
      next_payment_date: nextPaymentDate,
      description: description,
      date: date
    }).eq('id', id)

    if (error) throw error

    revalidatePath("/ad-support")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update ad support:", error)
    return { success: false, error: error.message || "Failed to update ad support" }
  }
}

export async function deleteAdSupport(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('ad_support').delete().eq('id', id)
    if (error) throw error

    revalidatePath("/ad-support")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete ad support:", error)
    return { success: false, error: error.message || "Failed to delete ad support" }
  }
}
