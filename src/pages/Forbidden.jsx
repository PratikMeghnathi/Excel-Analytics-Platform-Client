"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowLeft, Home, RefreshCw, Shield } from "lucide-react"

const usePermissionError = () => {
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const handlePermissionError = (event) => {
      const { message } = event.detail || {}
      console.log("Permission Error:", message)
      setErrorMessage(message || "Admin access required. You do not have permission to access this resource.")
    }

    // Set default message for direct navigation to forbidden page
    setErrorMessage("Admin access required. You do not have permission to access this resource.")

    window.addEventListener("permission-error", handlePermissionError)
    return () => {
      window.removeEventListener("permission-error", handlePermissionError)
    }
  }, [])

  return errorMessage
}

export default function ForbiddenPage() {
  const navigate = useNavigate()
  const errorMessage = usePermissionError()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/dashboard")
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate("/")
  }

  const currentTime = new Date().toLocaleString()

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-3 sm:mb-4">Access Denied</h2>

        {/* Error Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 bg-card border border-border rounded-md shadow-sm flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl text-destructive">
              <AlertTriangle />
            </span>
            <h3 className="text-base sm:text-lg font-semibold mt-2 text-card-foreground">Error Code</h3>
            <p className="text-xl sm:text-2xl font-bold text-destructive">403</p>
          </div>
          <div className="p-4 sm:p-6 bg-card border border-border rounded-md shadow-sm flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl text-muted-foreground">
              <Shield />
            </span>
            <h3 className="text-base sm:text-lg font-semibold mt-2 text-card-foreground">Access Level</h3>
            <p className="text-xl sm:text-2xl font-bold text-muted-foreground">Forbidden</p>
          </div>
        </div>

        {/* Error Details Section */}
        <div className="bg-card border border-border rounded-md shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-card-foreground">Error Details</h2>

          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-destructive mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-destructive mb-1">Access Forbidden</h3>
                <p className="text-sm text-card-foreground">{errorMessage}</p>
              </div>
            </div>
          </div>

          {/* Error Information */}
          <div className="space-y-2">
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <ul className="space-y-2">
                <li className="flex justify-between items-center font-semibold border-b border-border py-2 text-card-foreground">
                  <span className="w-[30%]">Property</span>
                  <span className="w-[70%]">Value</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-border text-sm">
                  <span className="w-[30%] text-muted-foreground">Status Code</span>
                  <span className="w-[70%] font-medium text-card-foreground">403 Forbidden</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-border text-sm">
                  <span className="w-[30%] text-muted-foreground">Error Type</span>
                  <span className="w-[70%] font-medium text-card-foreground">Permission Denied</span>
                </li>
                <li className="flex justify-between items-center py-2 text-sm">
                  <span className="w-[30%] text-muted-foreground">Timestamp</span>
                  <span className="w-[70%] font-medium text-card-foreground">{currentTime}</span>
                </li>
              </ul>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              <div className="border border-border rounded-md p-3 bg-card">
                <div className="text-xs text-muted-foreground mb-1">Status Code</div>
                <div className="font-medium text-card-foreground">403 Forbidden</div>
              </div>
              <div className="border border-border rounded-md p-3 bg-card">
                <div className="text-xs text-muted-foreground mb-1">Error Type</div>
                <div className="font-medium text-card-foreground">Permission Denied</div>
              </div>
              <div className="border border-border rounded-md p-3 bg-card">
                <div className="text-xs text-muted-foreground mb-1">Timestamp</div>
                <div className="font-medium text-card-foreground">{currentTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-card border border-border rounded-md shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-card-foreground">Available Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={handleGoBack}
              className="p-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md flex flex-col items-center justify-center transition-colors min-h-[80px]"
            >
              <ArrowLeft className="h-5 w-5 mb-2" />
              <span className="text-sm">Go Back</span>
            </button>

            <button
              onClick={handleRefresh}
              className="p-4 bg-muted hover:bg-accent hover:text-accent-foreground text-muted-foreground font-medium rounded-md border border-border flex flex-col items-center justify-center transition-colors min-h-[80px]"
            >
              <RefreshCw className="h-5 w-5 mb-2" />
              <span className="text-sm">Refresh Page</span>
            </button>

            <button
              onClick={handleGoHome}
              className="p-4 bg-muted hover:bg-accent hover:text-accent-foreground text-muted-foreground font-medium rounded-md border border-border flex flex-col items-center justify-center transition-colors min-h-[80px]"
            >
              <Home className="h-5 w-5 mb-2" />
              <span className="text-sm">Go Home</span>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-card border border-border rounded-md shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-card-foreground">Need Help?</h2>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-muted rounded-md">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-card-foreground mb-2">
                If you believe you should have access to this resource, please contact your system administrator.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="mailto:devzidio@gmail.com"
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 underline"
                >
                  Contact Support
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Response time: 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
