
import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  signIn: (password: string) => Promise<void>
  signUp: (password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

// Admin account configuration
const ADMIN_EMAIL = 'admin@meicho.com'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (password: string) => {
    try {
      console.log('Attempting to sign in with email:', ADMIN_EMAIL)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      })
      if (error) {
        console.error('Sign in error:', error)
        throw error
      }
      
      console.log('Sign in successful:', data)
      set({ user: data.user, session: data.session })
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  signUp: async (password: string) => {
    try {
      console.log('Attempting to create admin account with email:', ADMIN_EMAIL)
      
      // First check if user already exists
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
      if (!listError && existingUsers?.users?.some(user => user.email === ADMIN_EMAIL)) {
        throw new Error('User already registered')
      }

      const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        throw error
      }
      
      console.log('Sign up successful:', data)
      set({ user: data.user, session: data.session })
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null })
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  },

  updatePassword: async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  },
}))
