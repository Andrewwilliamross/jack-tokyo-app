
import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting to sign in with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('❌ Sign in error:', error.message)
        throw error
      }
      
      console.log('✅ Sign in successful')
      set({ user: data.user, session: data.session })
    } catch (error) {
      console.error('💥 Error signing in:', error)
      throw error
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      console.log('📝 Starting signup process for email:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
        }
      })
      
      if (error) {
        console.error('❌ Supabase signup error:', error.message)
        console.error('📋 Full error object:', error)
        throw error
      }
      
      console.log('✅ Supabase signup successful')
      console.log('👤 User data:', data.user)
      console.log('🎫 Session data:', data.session)
      
      // Check if user was created in auth.users
      if (data.user) {
        console.log('✅ User created in auth.users with ID:', data.user.id)
        
        // Give the trigger a moment to run
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if user_role was created
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', data.user.id)
          .single()
          
        if (roleError) {
          console.warn('⚠️ Could not verify user role creation:', roleError.message)
        } else {
          console.log('✅ User role created successfully:', roleData)
        }
      }
      
      set({ user: data.user, session: data.session })
    } catch (error) {
      console.error('💥 Error during signup:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      console.log('🚪 Signing out')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null })
      console.log('✅ Sign out successful')
    } catch (error) {
      console.error('💥 Error signing out:', error)
      throw error
    }
  },

  resetPassword: async (email: string) => {
    try {
      console.log('🔐 Resetting password for:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
      console.log('✅ Password reset email sent')
    } catch (error) {
      console.error('💥 Error resetting password:', error)
      throw error
    }
  },

  updatePassword: async (password: string) => {
    try {
      console.log('🔐 Updating password')
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
      console.log('✅ Password updated successfully')
    } catch (error) {
      console.error('💥 Error updating password:', error)
      throw error
    }
  },
}))
