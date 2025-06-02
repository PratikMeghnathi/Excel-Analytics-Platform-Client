"use client"

import { signin, forgotPassword } from "@/api"
import { Spinner1 } from "@/components"
import { useAuth } from "@/context"
import { ERROR_TOAST_OPTIONS, PATHS, showGenericErrorAsToast, SUCCESS_TOAST_OPTIONS, TOAST_OPTIONS } from "@/utils"
import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useImmer } from "use-immer"
import { BarChart3, Mail, Lock, AlertCircle, ArrowRight, CheckCircle } from "lucide-react"

function Signin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  const searchParams = new URLSearchParams(location.search)
  const redirectTo = searchParams.get("redirect") || PATHS.DASHBOARD

  const [formData, setFormData] = useImmer({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetEmailError, setResetEmailError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((draft) => {
      draft[name] = value
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!formData.email || !formData.password) {
        setError("All fields are required!")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address!")
        return
      }

      const { success, data, fieldErrors, genericErrors } = await signin({
        email: formData.email,
        password: formData.password,
      })

      if (success && data?.user) {
        setUser(data.user)

        setFormData((draft) => {
          draft.email = ""
          draft.password = ""
        })
        setError("")

        toast.success("Welcome back! Let's get started.", SUCCESS_TOAST_OPTIONS)
        navigate(redirectTo, { replace: true })
        return
      }

      if (fieldErrors && fieldErrors.credentials) {
        setError(fieldErrors.credentials)
      }
      showGenericErrorAsToast(genericErrors)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setResetEmailError("")

    // Validate email
    if (!resetEmail) {
      setResetEmailError("Email address is required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      setResetEmailError("Please enter a valid email address")
      return
    }

    setIsResetLoading(true)

    try {
      const { success, data, fieldErrors, genericErrors } = await forgotPassword({
        email: resetEmail,
      })

      if (success) {
        setResetEmailSent(true)
      } else {
        // Handle field-specific errors
        if (fieldErrors?.email) {
          setResetEmailError(fieldErrors.email)
        }

        // Handle generic errors
        if (genericErrors) {
          Object.values(genericErrors).forEach((error) => {
            toast.error(error, ERROR_TOAST_OPTIONS)
          })
        }
      }
    } catch (error) {
      console.error("Error sending reset email:", error)
      toast.error("Failed to send reset email. Please try again.", ERROR_TOAST_OPTIONS)
    } finally {
      setIsResetLoading(false)
    }
  }

  const closeResetModal = () => {
    setIsModalOpen(false)
    setResetEmail("")
    setResetEmailError("")
    setResetEmailSent(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={PATHS.WELCOME} className="inline-flex items-center gap-2 mb-6">
            <BarChart3 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Excel Analytics</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue analyzing your data</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Spinner1 className="w-4 h-4 border-2 border-primary-foreground" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to={PATHS.SIGNUP} className="text-primary hover:underline font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">Secure access to your Excel Analytics Platform</p>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Reset Password</h3>
              <button
                onClick={closeResetModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </div>

            {resetEmailSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Check Your Email</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  If an account exists with this email, we've sent a password reset link.
                </p>
                <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground text-left">
                      <p className="font-medium text-foreground mb-1">Important:</p>
                      <ul className="space-y-1">
                        <li>• The reset link expires in 30 minutes</li>
                        <li>• Check your spam folder if you don't see the email</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeResetModal}
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-medium text-card-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        id="resetEmail"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value)
                          setResetEmailError("")
                        }}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    {resetEmailError && (
                      <div className="flex items-center gap-2 mt-2">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <p className="text-sm text-destructive">{resetEmailError}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeResetModal}
                      className="flex-1 px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isResetLoading}
                      className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isResetLoading ? (
                        <>
                          <Spinner1 className="w-4 h-4 border-2 border-primary-foreground" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Signin
