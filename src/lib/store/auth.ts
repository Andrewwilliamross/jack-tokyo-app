import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  isEmailVerified: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  checkEmailVerification: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isEmailVerified: false,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, session: data.session })
      await get().checkEmailVerification()
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      set({ user: data.user, session: data.session })
      await get().checkEmailVerification()
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null, isEmailVerified: false })
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
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

  checkEmailVerification: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      set({ isEmailVerified: user?.email_confirmed_at !== null })
      return user?.email_confirmed_at !== null
    } catch (error) {
      console.error('Error checking email verification:', error)
      return false
    }
  },
})) 