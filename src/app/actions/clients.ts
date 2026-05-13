"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  status: z.enum(["Lead", "Active", "Inactive"]).default("Lead"),
})

export async function addClient(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const rawData = {
      name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
    }

    const validatedData = clientSchema.parse(rawData)

    const { error } = await supabase
      .from('clients')
      .insert({
        ...validatedData,
        email: validatedData.email || null,
        created_by: user.id
      })

    if (error) throw error
    
    revalidatePath("/clients")
    revalidatePath("/clients/pipeline")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to add client:", error)
    return { success: false, error: error.message || "Failed to add client" }
  }
}

export async function updateClientStatus(clientId: string, newStatus: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('clients')
      .update({ status: newStatus })
      .eq('id', clientId)

    if (error) throw error
    
    revalidatePath("/clients")
    revalidatePath("/clients/pipeline")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update status:", error)
    return { success: false, error: error.message || "Failed to update status" }
  }
}
export async function updateClient(clientId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const rawData = {
      name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
    }
    const validatedData = clientSchema.parse(rawData)
    const { error } = await supabase
      .from('clients')
      .update({
        ...validatedData,
        email: validatedData.email || null
      })
      .eq('id', clientId)
    if (error) throw error
    revalidatePath("/clients")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update client" }
  }
}

export async function deleteClient(clientId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('clients').delete().eq('id', clientId)
    if (error) throw error
    revalidatePath("/clients")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete client" }
  }
}
