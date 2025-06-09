
import { useState } from 'react'
import { useAuthStore } from '../../lib/store/auth'
import { Button } from '../ui/button'
import { toast } from 'sonner'

interface EmailVerificationProps {
  email: string
}

export function EmailVerification({ email }: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const signUp = useAuthStore((state) => state.signUp)

  const handleResendVerification = async () => {
    try {
      setIsLoading(true)
      // Since we're now using password-only auth, we can't resend verification
      // This component is no longer needed with our simplified auth system
      toast.error('Email verification is not available with password-only authentication')
    } catch (error) {
      toast.error('Failed to send verification email')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Account Created</h3>
        <p className="text-sm text-gray-600">
          Your admin account has been created successfully. You can now sign in with your password.
        </p>
      </div>
      <Button
        onClick={() => window.location.href = '/login'}
        variant="outline"
      >
        Go to Login
      </Button>
    </div>
  )
} 
