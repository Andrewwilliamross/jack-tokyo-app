
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../lib/store/auth'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const signUp = useAuthStore((state) => state.signUp)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true)
      console.log('Creating account for:', data.email)
      await signUp(data.email, data.password)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Sign up error:', error)
      
      // Handle specific error messages
      if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
        toast.error('This email is already registered. Please sign in instead.')
        setTimeout(() => navigate('/login'), 1500)
      } else if (error.message?.includes('Password')) {
        toast.error('Password must be at least 6 characters long.')
      } else if (error.message?.includes('Invalid')) {
        toast.error('Please check your email and password and try again.')
      } else if (error.message?.includes('Email not confirmed')) {
        toast.success('Account created! Please sign in.')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        toast.error('Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="bg-background border-border"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create password"
          className="bg-background border-border"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          className="bg-background border-border"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full run-button text-white py-3 px-4 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Sign up with any email to get started.
        </p>
      </div>
    </form>
  )
}
