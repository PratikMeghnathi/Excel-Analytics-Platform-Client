"use client"

import { verifyEmail, resendVerificationEmail } from "@/api"
import { Spinner1 } from "@/components"
import { ERROR_TOAST_OPTIONS, PATHS, SUCCESS_TOAST_OPTIONS, TOAST_OPTIONS } from "@/utils"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { BarChart3, CheckCircle, AlertCircle, RefreshCw, Mail, ArrowLeft } from "lucide-react"

function VerifyEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [verificationState, setVerificationState] = useState("verifying") // 'verifying', 'success', 'error', 'expired'
  const [isLoading, setIsLoading] = useState(true)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [resendEmail, setResendEmail] = useState("")

  useEffect(() => {
    if (!token) {
      setVerificationState("error")
      setErrorMessage("No verification token provided.")
      setIsLoading(false)
      return
    }

    handleVerification()
  }, [token])

  // Update the handleVerification function to properly handle field errors vs generic errors
  const handleVerification = async () => {
    try {
      setIsLoading(true)
      const { success, data, fieldErrors, genericErrors } = await verifyEmail(token)

      if (success) {
        setVerificationState("success")
        setUserEmail(data.user?.email || "")
        toast.success("Email verified successfully! Your account has been created.", SUCCESS_TOAST_OPTIONS)

        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          navigate(PATHS.SIGNIN)
        }, 3000)
      } else {
        // Handle field-specific errors
        if (fieldErrors) {
          if (fieldErrors.token) {
            setVerificationState(fieldErrors.token.includes("expired") ? "expired" : "error")
            setErrorMessage(fieldErrors.token)
          } else if (fieldErrors.email) {
            setVerificationState("error")
            setErrorMessage(fieldErrors.email)
          }
        }

        // Handle generic errors
        if (genericErrors) {
          setVerificationState("error")
          const errorMessages = Object.values(genericErrors)
          if (errorMessages.length > 0) {
            setErrorMessage(errorMessages[0])
            // Also show as toast for visibility
            errorMessages.forEach((error) => {
              toast.error(error, ERROR_TOAST_OPTIONS)
            })
          } else {
            setErrorMessage("Verification failed. Please try again.")
          }
        }

        // If no specific errors were found
        if (!fieldErrors && !genericErrors) {
          setVerificationState("error")
          setErrorMessage("Verification failed. Please try again.")
        }
      }
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationState("error")
      setErrorMessage("An unexpected error occurred. Please try again.")
      toast.error("An unexpected error occurred. Please try again.", ERROR_TOAST_OPTIONS)
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleResendVerification function to properly handle field errors vs generic errors
  const handleResendVerification = async () => {
    if (!resendEmail.trim()) {
      toast.error("Please enter your email address.", ERROR_TOAST_OPTIONS)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resendEmail)) {
      toast.error("Please enter a valid email address.", ERROR_TOAST_OPTIONS)
      return
    }

    try {
      setIsResending(true)
      const { success, data, fieldErrors, genericErrors } = await resendVerificationEmail({ email: resendEmail })

      if (success) {
        toast.success("Verification email sent! Please check your inbox.", SUCCESS_TOAST_OPTIONS)
        setResendEmail("")
      } else {
        // Handle field-specific errors
        if (fieldErrors?.email) {
          // Show email error directly in the UI near the email field
          toast.error(fieldErrors.email, ERROR_TOAST_OPTIONS)
        }

        // Handle generic errors as toast notifications
        if (genericErrors) {
          Object.values(genericErrors).forEach((error) => {
            toast.error(error, ERROR_TOAST_OPTIONS)
          })
        }
      }
    } catch (error) {
      console.error("Resend error:", error)
      toast.error("Failed to resend verification email. Please try again.", ERROR_TOAST_OPTIONS)
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (verificationState) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Spinner1 className="w-8 h-8 border-2 border-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Your Email</h1>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Email Verified Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Your account has been created and verified. You can now sign in to Excel Analytics.
            </p>
            {userEmail && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Account created for:</strong> {userEmail}
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Link
                to={PATHS.SIGNIN}
                className="block w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium text-center"
              >
                Continue to Sign In
              </Link>
              <p className="text-sm text-muted-foreground">Redirecting automatically in 3 seconds...</p>
            </div>
          </div>
        )

      case "expired":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verification Link Expired</h1>
            <p className="text-muted-foreground mb-6">
              Your verification link has expired. Please request a new verification email.
            </p>

            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
              <label htmlFor="resendEmail" className="block text-sm font-medium text-foreground mb-2">
                Enter your email address
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    id="resendEmail"
                    placeholder="Enter your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium whitespace-nowrap"
                >
                  {isResending ? (
                    <Spinner1 className="w-4 h-4 border-2 border-primary-foreground" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </div>
            </div>

            <Link
              to={PATHS.SIGNUP}
              className="block w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-md hover:bg-secondary/80 transition-colors font-medium text-center"
            >
              Back to Sign Up
            </Link>
          </div>
        )

      case "error":
      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage || "We couldn't verify your email address. The link may be invalid or expired."}
            </p>

            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
              <label htmlFor="resendEmail" className="block text-sm font-medium text-foreground mb-2">
                Request a new verification email
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    id="resendEmail"
                    placeholder="Enter your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium whitespace-nowrap"
                >
                  {isResending ? (
                    <Spinner1 className="w-4 h-4 border-2 border-primary-foreground" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to={PATHS.SIGNUP}
                className="block w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-md hover:bg-secondary/80 transition-colors font-medium text-center"
              >
                Back to Sign Up
              </Link>

              <Link
                to={PATHS.SIGNIN}
                className="block w-full text-center text-primary hover:underline font-medium py-2"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        )
    }
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
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8">{renderContent()}</div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link
            to={PATHS.WELCOME}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
