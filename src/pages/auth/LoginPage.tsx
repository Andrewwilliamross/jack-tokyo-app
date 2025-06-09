
import { Link } from 'react-router-dom'
import { LoginForm } from '../../components/auth/LoginForm'
import { DevAuthBypass } from '../../components/auth/DevAuthBypass'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="ticket-card bg-card p-8 rounded-lg shadow-lg border border-neon-pink/30">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold neon-glow mb-2">Welcome to</h1>
            <h2 className="text-3xl font-bold neon-glow">Meicho Shimbun RPG</h2>
          </div>
          <LoginForm />
          <DevAuthBypass />
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-neon-pink hover:text-neon-pink/80 transition-colors"
              >
                Create a new account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
