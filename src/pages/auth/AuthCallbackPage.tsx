import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../supabase/config/client'
import { useAuthStore } from '../../lib/store/auth'
import { toast } from 'sonner'

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        const type = searchParams.get('type')
        if (type === 'recovery') {
          // Handle password reset
          const accessToken = searchParams.get('access_token')
          if (accessToken) {
            navigate('/auth/update-password')
          }
        } else {
          // Handle successful authentication
          if (session?.user) {
            useAuthStore.setState({ 
              user: session.user, 
              session,
              loading: false 
            })
            toast.success('Successfully authenticated')
            navigate('/dashboard')
          } else {
            toast.error('Authentication failed')
            navigate('/login')
          }
        }
      } catch (error) {
        console.error('Error handling auth callback:', error)
        toast.error('Authentication failed')
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    handleAuthCallback()
  }, [searchParams, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Processing...</h2>
          <p className="text-gray-600">Please wait while we complete the authentication process.</p>
        </div>
      </div>
    )
  }

  return null
}
