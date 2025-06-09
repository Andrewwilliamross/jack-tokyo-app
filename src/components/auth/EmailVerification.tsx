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
      // We'll use signUp with the same email to trigger a new verification email
      await signUp(email, '')
      toast.success('Verification email sent')
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
        <h3 className="text-lg font-medium">Verify your email</h3>
        <p className="text-sm text-gray-600">
          We've sent a verification email to {email}. Please check your inbox and
          click the verification link.
        </p>
      </div>
      <Button
        onClick={handleResendVerification}
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? 'Sending...' : 'Resend verification email'}
      </Button>
    </div>
  )
} 