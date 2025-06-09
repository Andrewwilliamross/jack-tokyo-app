
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../lib/store/auth'
import { Button } from '../ui/button'

export function DevAuthBypass() {
  const navigate = useNavigate()
  
  // Only show in development
  if (import.meta.env.PROD) return null

  const handleDevLogin = () => {
    // Set a mock user for development
    useAuthStore.setState({
      user: {
        id: 'dev-user-id',
        email: 'admin@meicho.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      } as any,
      session: {
        access_token: 'dev-token',
        refresh_token: 'dev-refresh',
        user: {
          id: 'dev-user-id',
          email: 'admin@meicho.com'
        }
      } as any
    })
    navigate('/dashboard')
  }

  return (
    <div className="mt-4 p-4 border border-orange-200 rounded-md bg-orange-50">
      <p className="text-sm text-orange-800 mb-2">Development Mode:</p>
      <Button 
        onClick={handleDevLogin}
        variant="outline"
        size="sm"
        className="text-orange-800 border-orange-300"
      >
        Bypass Auth (Dev Only)
      </Button>
    </div>
  )
}
