
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../lib/store/auth'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await signIn(data.password)
      toast.success('Successfully logged in')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid password. Please try again.')
      } else if (error.message?.includes('Too many requests')) {
        toast.error('Too many login attempts. Please wait a moment and try again.')
      } else {
        toast.error('Failed to log in. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">Admin Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter admin password"
          className="bg-background border-border"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full run-button text-white py-3 px-4 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
