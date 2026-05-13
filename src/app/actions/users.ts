"use server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "Manager", "Staff"]).default("Staff"),
})

export async function createTeamMember(formData: FormData) {
  try {
    const adminClient = createAdminClient()
    const serverClient = await createClient()

    const { data: { user: adminUser } } = await serverClient.auth.getUser()
    if (!adminUser) return { success: false, error: "Unauthorized" }

    // Check if requester is Admin
    const { data: adminProfile } = await serverClient.from('profiles').select('role').eq('id', adminUser.id).single()
    if (adminProfile?.role !== 'Admin') return { success: false, error: "Only admins can create members" }

    const validatedData = userSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    })

    // 1. Create user in Auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: { name: validatedData.name }
    })

    if (authError) throw authError

    // 2. Create profile (use adminClient to bypass RLS)
    const { error: profileError } = await adminClient.from('profiles').insert({
      id: authData.user.id,
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role
    })

    if (profileError) {
      // Cleanup auth user if profile fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    revalidatePath("/settings")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to create member:", error)
    return { success: false, error: error.message || "Failed to create member" }
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // Check if current user is Admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'Admin') return { success: false, error: "Only admins can change roles" }

    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) throw error

    revalidatePath("/settings")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update role:", error)
    return { success: false, error: error.message || "Failed to update role" }
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // Check if current user is Admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'Admin') return { success: false, error: "Only admins can delete users" }

    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) throw error

    revalidatePath("/settings")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete user:", error)
    return { success: false, error: error.message || "Failed to delete user" }
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Failed to update password:", error)
    return { success: false, error: error.message || "Failed to update password" }
  }
}
