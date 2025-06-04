import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { resetPassword, verifyResetToken } from "@/api"
import { Spinner1 } from "@/components"
import {
  ERROR_TOAST_OPTIONS, PATHS, SUCCESS_TOAST_OPTIONS,
  BarChart3, CheckCircle, AlertCircle, Lock, EyeOff, Eye, ArrowLeft
} from "@/utils"

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [verificationState, setVerificationState] = useState("verifying") // 'verifying', 'valid', 'invalid', 'success'
  const [isLoading, setIsLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [expiresIn, setExpiresIn] = useState("")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    if (!token) {
      setVerificationState("invalid")
      setErrorMessage("No reset token provided.")
      setIsLoading(false)
      return
    }

    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      setIsLoading(true)
      const { success, data, fieldErrors, genericErrors } = await verifyResetToken(token)

      if (success && data?.valid) {
        setVerificationState("valid")
        setUserEmail(data.email || "")
        setExpiresIn(data.expiresIn || "")
      } else {
        setVerificationState("invalid")

        // Handle field-specific errors
        if (fieldErrors?.token) {
          setErrorMessage(fieldErrors.token)
        }
        // Handle generic errors
        else if (genericErrors) {
          const errorMessages = Object.values(genericErrors)
          if (errorMessages.length > 0) {
            setErrorMessage(errorMessages[0])
          } else {
            setErrorMessage("Invalid or expired password reset token.")
          }
        } else {
          setErrorMessage("Invalid or expired password reset token.")
        }
      }
    } catch (error) {
      console.error("Token verification error:", error)
      setVerificationState("invalid")
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (password.length < 6) return { strength: "Weak", color: "text-destructive" }
    if (password.length < 10) return { strength: "Moderate", color: "text-amber-600" }
    return { strength: "Strong", color: "text-green-600" }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setPasswordError("")

    // Validate password
    if (!newPassword) {
      setPasswordError("Password is required")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    setIsResetting(true)

    try {
      const { success, data, fieldErrors, genericErrors } = await resetPassword({
        token,
        newPassword,
      })

      if (success) {
        setVerificationState("success")
        toast.success("Password reset successful! You can now sign in with your new password.", SUCCESS_TOAST_OPTIONS)

        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          navigate(PATHS.SIGNIN)
        }, 3000)
      } else {
        // Handle field-specific errors
        if (fieldErrors) {
          if (fieldErrors.token) {
            setErrorMessage(fieldErrors.token)
            setVerificationState("invalid")
          } else if (fieldErrors.password) {
            setPasswordError(fieldErrors.password)
          } else if (fieldErrors.user) {
            setErrorMessage(fieldErrors.user)
            setVerificationState("invalid")
          } else if (fieldErrors.input) {
            setPasswordError(fieldErrors.input)
          }
        }

        // Handle generic errors
        if (genericErrors) {
          Object.values(genericErrors).forEach((error) => {
            toast.error(error, ERROR_TOAST_OPTIONS)
          })
        }
      }
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("An unexpected error occurred. Please try again.", ERROR_TOAST_OPTIONS)
    } finally {
      setIsResetting(false)
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  const renderContent = () => {
    switch (verificationState) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Spinner1 className="w-8 h-8 border-2 border-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Reset Link</h1>
            <p className="text-muted-foreground">Please wait while we verify your password reset link...</p>
          </div>
        )

      case "valid":
        return (
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground mb-6">
              Create a new password for your account: <span className="font-medium text-foreground">{userEmail}</span>
            </p>

            {expiresIn && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">This reset link expires in {expiresIn}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-card-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setPasswordError("")
                    }}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                  {newPassword && (
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.strength === "Weak"
                          ? "w-1/3 bg-destructive"
                          : passwordStrength.strength === "Moderate"
                            ? "w-2/3 bg-amber-500"
                            : "w-full bg-green-500"
                          }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.strength}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setPasswordError("")
                    }}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                  {confirmPassword && (
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {confirmPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-sm text-destructive">{passwordError}</p>
                  </div>
                )}

                {confirmPassword && newPassword === confirmPassword && !passwordError && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-600">Passwords match</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium mt-4"
              >
                {isResetting ? (
                  <>
                    <Spinner1 className="w-4 h-4 border-2 border-primary-foreground" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        )

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
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

      case "invalid":
      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage || "The password reset link is invalid or has expired."}
            </p>
            <div className="space-y-3">
              <Link
                to={PATHS.SIGNIN}
                className="block w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium text-center"
              >
                Back to Sign In
              </Link>
              <p className="text-sm text-muted-foreground">
                Need a new reset link?{" "}
                <Link to={PATHS.SIGNIN} className="text-primary hover:underline">
                  Click here
                </Link>{" "}
                to request one.
              </p>
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

export default ResetPassword
