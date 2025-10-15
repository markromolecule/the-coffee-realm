import { supabase } from '@/lib/supabase'
import { type User } from '@supabase/supabase-js'

export type CreateUserProfileServiceArgs = {
  user: User
  firstName?: string
  lastName?: string
}

export type CreateUserProfileServiceResult = {
  success: boolean
  error?: string
}

export async function createUserProfileService({
  user,
  firstName,
  lastName,
}: CreateUserProfileServiceArgs): Promise<CreateUserProfileServiceResult> {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      return {
        success: false,
        error: `Failed to check existing profile: ${fetchError.message}`,
      }
    }

    if (existingProfile) {
      // Profile already exists, no need to create
      return { success: true }
    }

    // Extract name from user metadata or use provided values
    const finalFirstName = firstName || user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || ''
    const finalLastName = lastName || user.user_metadata?.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' ') || ''

    // Create new profile
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        first_name: finalFirstName,
        last_name: finalLastName,
        email: user.email || '',
      })

    if (insertError) {
      return {
        success: false,
        error: `Failed to create user profile: ${insertError.message}`,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error creating user profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
