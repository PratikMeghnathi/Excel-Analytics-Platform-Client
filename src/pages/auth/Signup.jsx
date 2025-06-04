import { signup } from "@/api"
import { Spinner1 } from "@/components"
import {
  ERROR_TOAST_OPTIONS, Eye, PATHS, SUCCESS_TOAST_OPTIONS,
  BarChart3, CheckCircle, AlertCircle, User, Mail, Lock, EyeOff, Send
} from "@/utils"
import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { useImmer } from "use-immer"

function Signup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useImmer({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [errors, setErrors] = useImmer({
    passwordMismatch: "",
    emailExists: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((draft) => {
      draft[name] = type === "checkbox" ? checked : value
    })
    setErrors((draft) => {
      if (name === "password" || name === "confirmPassword") {
        draft.passwordMismatch = ""
      }
      if (name === "email") {
        draft.emailExists = ""
      }
    })
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev)
  }

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (password.length < 6) return { strength: "Weak", color: "text-destructive" }
    if (password.length < 10) return { strength: "Moderate", color: "text-amber-600" }
    return { strength: "Strong", color: "text-green-600" }
  }

  // Update the handleSubmit function to properly handle field errors vs generic errors
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ passwordMismatch: "", emailExists: "" })

    setIsLoading(true)
    try {
      if (formData.password !== formData.confirmPassword) {
        return setErrors((draft) => {
          draft.passwordMismatch = "Passwords do not match"
        })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        return setErrors((draft) => {
          draft.emailExists = "Please enter a valid email address!"
        })
      }

      const { success, data, fieldErrors, genericErrors } = await signup({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })

      if (success) {
        setEmailSent(true)
        setRegisteredEmail(formData.email)
        toast.success("Verification email sent! Please check your inbox.", SUCCESS_TOAST_OPTIONS)
        return
      }

      // Handle field-specific errors (display near the fields)
      if (fieldErrors) {
        setErrors((draft) => {
          // Handle email field errors
          if (fieldErrors.email) {
            draft.emailExists = fieldErrors.email
          }

          // Handle password field errors
          if (fieldErrors.password) {
            draft.passwordMismatch = fieldErrors.password
          }

          // Handle input field errors (could be for any field)
          if (fieldErrors.input) {
            draft.emailExists = fieldErrors.input
          }
        })
      }

      // Handle generic errors (display as toast)
      if (genericErrors) {
        Object.values(genericErrors).forEach((error) => {
          toast.error(error, ERROR_TOAST_OPTIONS)
        })
      }
    } catch (error) {
      console.log(error)
      toast.error("An unexpected error occurred. Please try again.", ERROR_TOAST_OPTIONS)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSignup = () => {
    setEmailSent(false)
    setRegisteredEmail("")
    setFormData((draft) => {
      draft.username = ""
      draft.email = ""
      draft.password = ""
      draft.confirmPassword = ""
      draft.termsAccepted = false
    })
    setErrors((draft) => {
      draft.passwordMismatch = ""
      draft.emailExists = ""
    })
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Email sent success screen
  if (emailSent) {
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

          {/* Success Message */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a verification link to <span className="font-medium text-foreground">{registeredEmail}</span>
            </p>

            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground text-left">
                  <p className="font-medium text-foreground mb-1">Important:</p>
                  <ul className="space-y-1">
                    <li>• The verification link expires in 15 minutes</li>
                    <li>• Check your spam folder if you don't see the email</li>
                    <li>• Click the link to complete your registration</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToSignup}
                className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-md hover:bg-secondary/80 transition-colors font-medium"
              >
                Try Different Email
              </button>

              <Link
                to={PATHS.SIGNIN}
                className="block w-full text-center text-primary hover:underline font-medium py-2"
              >
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again with a different email address.
            </p>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join us and start analyzing your Excel data</p>
        </div>

        {/* Signup Form */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-card-foreground mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

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
              {errors.emailExists && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{errors.emailExists}</p>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
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
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
                />
                {formData.confirmPassword && (
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {confirmPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {errors.passwordMismatch && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{errors.passwordMismatch}</p>
                </div>
              )}
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                !errors.passwordMismatch && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-600">Passwords match</p>
                  </div>
                )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 text-primary focus:ring-primary/50 border-border rounded"
              />
              <label htmlFor="termsAccepted" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to={PATHS.TERMS_OF_SERVICES} className="text-primary hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link to={PATHS.PRIVACY_POLICY} className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.termsAccepted}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Spinner1 className="w-4 h-4 border-2 border-primary-foreground" />
                  Sending Verification Email...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to={PATHS.SIGNIN} className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By creating an account, you're joining our Excel Analytics Platform
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
