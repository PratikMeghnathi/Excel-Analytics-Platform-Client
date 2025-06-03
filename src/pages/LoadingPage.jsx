"use client"

import { BarChart3, Loader2, Database, FileSpreadsheet, Brain } from "lucide-react"

function LoadingPage({
  message = "Loading...",
  subtitle = "Please wait while we process your request",
  showSkeletons = true,
  type = "general", // "general", "data", "chart", "ai"
}) {
  const getLoadingIcon = () => {
    switch (type) {
      case "data":
        return <Database className="w-8 h-8 text-primary animate-pulse" />
      case "chart":
        return <BarChart3 className="w-8 h-8 text-primary animate-pulse" />
      case "ai":
        return <Brain className="w-8 h-8 text-primary animate-pulse" />
      case "file":
        return <FileSpreadsheet className="w-8 h-8 text-primary animate-pulse" />
      default:
        return <Loader2 className="w-8 h-8 text-primary animate-spin" />
    }
  }

  const getLoadingMessages = () => {
    switch (type) {
      case "data":
        return {
          message: "Processing Data...",
          subtitle: "Analyzing your Excel file and preparing visualizations",
        }
      case "chart":
        return {
          message: "Generating Chart...",
          subtitle: "Creating your data visualization",
        }
      case "ai":
        return {
          message: "Generating AI Insights...",
          subtitle: "Our AI is analyzing your data to provide meaningful insights",
        }
      case "file":
        return {
          message: "Uploading File...",
          subtitle: "Processing your Excel file",
        }
      default:
        return { message, subtitle }
    }
  }

  const loadingContent = getLoadingMessages()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BarChart3 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Excel Analytics</span>
          </div>
        </div>

        {/* Loading Content */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 text-center">
          {/* Loading Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {getLoadingIcon()}
          </div>

          {/* Loading Text */}
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">{loadingContent.message}</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{loadingContent.subtitle}</p>

          {/* Progress Indicator */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>

          {/* Skeleton Loaders */}
          {showSkeletons && (
            <div className="space-y-4">
              <div className="text-left">
                <div className="text-sm font-medium text-card-foreground mb-2">Processing...</div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-4/5"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-3/5"></div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Tips */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              {type === "ai" && "AI analysis may take a few moments for complex datasets"}
              {type === "data" && "Large files may take longer to process"}
              {type === "chart" && "Complex visualizations are being optimized for best performance"}
              {type === "file" && "Please don't close this window while uploading"}
              {type === "general" && "This should only take a moment"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage
