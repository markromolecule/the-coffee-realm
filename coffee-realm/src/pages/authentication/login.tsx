import React, { useState, useEffect } from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mail, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AuthHeader } from './_components/auth-header'
import { AuthMessages } from './_components/auth-messages'
import { GoogleSignInButton } from './_components/google-sign-in-button'

export const Login: React.FC = () => {
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user, signIn, signInWithGoogle } = useAuth()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      return
    }
  }, [user, from])

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)

    const { error } = await signInWithGoogle()
    
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <AuthHeader />
        
        <Card className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4 sm:pb-6 pt-4 sm:pt-6 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-center text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-500 text-sm">
              Sign in to your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6 pt-0">
            <AuthMessages error={error} success={null} />

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "h-11 pl-10 pr-4 border-gray-200 rounded-lg",
                      "focus:border-orange-500 focus:ring-1 focus:ring-orange-500",
                      "transition-colors placeholder:text-gray-400"
                    )}
                    required
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "h-11 pl-10 pr-4 border-gray-200 rounded-lg",
                      "focus:border-orange-500 focus:ring-1 focus:ring-orange-500",
                      "transition-colors placeholder:text-gray-400"
                    )}
                    required
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className={cn(
                  "w-full h-11 bg-orange-500 hover:bg-orange-600",
                  "text-white font-medium rounded-lg",
                  "transition-colors"
                )}
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <GoogleSignInButton 
              onClick={handleGoogleSignIn}
              loading={googleLoading}
              disabled={loading || googleLoading}
            />

            {/* Link to Register */}
            <div className="text-center pt-3">
              <Link
                to="/register"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Don't have an account? Sign up
              </Link>
            </div>

            {/* Footer */}
            <div className="text-center pt-3">
              <p className="text-xs text-gray-400">
                Powered by Supabase
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
