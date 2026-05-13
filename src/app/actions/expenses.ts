"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const expenseSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  date: z.string().min(1, "Date is required"),
})

export async function addExpense(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const validatedData = expenseSchema.parse({
      description: formData.get("title"), // Keep form input name as 'title' for simplicity or rename it too
      category: formData.get("category"),
      amount: formData.get("amount"),
      date: formData.get("date"),
    })

    const { error } = await supabase.from('expenses').insert({
      ...validatedData,
      created_by: user.id
    })

    if (error) throw error

    revalidatePath("/expenses")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to add expense:", error)
    return { success: false, error: error.message || "Failed to add expense" }
  }
}
export async function updateExpense(expenseId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const validatedData = expenseSchema.parse({
      description: formData.get("title"),
      category: formData.get("category"),
      amount: formData.get("amount"),
      date: formData.get("date"),
    })
    const { error } = await supabase.from('expenses').update(validatedData).eq('id', expenseId)
    if (error) throw error
    revalidatePath("/expenses")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update expense" }
  }
}

export async function deleteExpense(expenseId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId)
    if (error) throw error
    revalidatePath("/expenses")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete expense" }
  }
}
