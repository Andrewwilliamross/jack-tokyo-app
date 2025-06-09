
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

interface EmailVerificationProps {
  email: string
}

export function EmailVerification({ email }: EmailVerificationProps) {
  const navigate = useNavigate()

  // Auto-redirect to login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="text-center space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Account Created</h3>
        <p className="text-sm text-gray-600">
          Your admin account has been created successfully. You can now sign in with your password.
        </p>
        <p className="text-xs text-gray-500">
          Redirecting to login in 3 seconds...
        </p>
      </div>
      <Button
        onClick={() => navigate('/login')}
        variant="outline"
      >
        Go to Login Now
      </Button>
    </div>
  )
}
