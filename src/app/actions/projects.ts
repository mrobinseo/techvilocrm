"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  client_id: z.string().uuid("Invalid client selection"),
  service: z.string().min(1, "Service type is required"),
  status: z.enum(["Active", "In Progress", "Completed"]).default("Active"),
  billing_type: z.string().min(1, "Billing type is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  next_payment_date: z.string().optional().nullable(),
})

export async function addProject(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    let service = formData.get("service") as string
    if (service === "Custom") {
      service = formData.get("customService") as string
    }

    const rawData = {
      name: formData.get("projectName"),
      client_id: formData.get("client"),
      service,
      status: formData.get("status") || "Active",
      billing_type: formData.get("billing"),
      amount: formData.get("total"),
      next_payment_date: formData.get("nextDate") || null,
    }

    const validatedData = projectSchema.parse(rawData)

    const { error } = await supabase
      .from('projects')
      .insert({
        ...validatedData,
        paid_amount: 0,
        due_amount: validatedData.amount,
        created_by: user.id
      })

    if (error) throw error
    
    revalidatePath("/projects")
    revalidatePath("/payments")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to add project:", error)
    return { success: false, error: error.message || "Failed to add project" }
  }
}
export async function updateProject(projectId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    let service = formData.get("service") as string
    if (service === "Custom") {
      service = formData.get("customService") as string
    }
    const rawData = {
      name: formData.get("projectName"),
      client_id: formData.get("client"),
      service,
      status: formData.get("status"),
      billing_type: formData.get("billing"),
      amount: formData.get("total"),
      next_payment_date: formData.get("nextDate") || null,
    }
    const validatedData = projectSchema.parse(rawData)
    
    // We also need to update the due_amount if the total amount changed
    const { data: project } = await supabase.from('projects').select('paid_amount').eq('id', projectId).single()
    const paidAmount = project?.paid_amount || 0
    const newDueAmount = validatedData.amount - paidAmount

    const { error } = await supabase
      .from('projects')
      .update({
        ...validatedData,
        due_amount: newDueAmount
      })
      .eq('id', projectId)

    if (error) throw error
    revalidatePath("/projects")
    revalidatePath("/payments")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update project" }
  }
}

export async function deleteProject(projectId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('projects').delete().eq('id', projectId)
    if (error) throw error
    revalidatePath("/projects")
    revalidatePath("/payments")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete project" }
  }
}
