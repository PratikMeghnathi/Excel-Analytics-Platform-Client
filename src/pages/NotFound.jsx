import { PATHS,BarChart3, Home, ArrowLeft, FileQuestion, RefreshCw  } from "@/utils"
import { Link, useNavigate } from "react-router-dom"

function NotFoundPage({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showSearchSuggestions = true,
  customActions = null,
}) {
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(PATHS.WELCOME)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={PATHS.WELCOME} className="inline-flex items-center gap-2 mb-6">
            <BarChart3 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Excel Analytics</span>
          </Link>
        </div>

        {/* 404 Content */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 text-center">
          {/* 404 Icon */}
          <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-12 h-12 text-muted-foreground" />
          </div>

          {/* Error Code */}
          <div className="text-6xl sm:text-7xl font-bold text-primary/20 mb-4">404</div>

          {/* Error Message */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{title}</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">{message}</p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link to={PATHS.WELCOME}>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Home Page
              </button>
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Custom Actions */}
          {customActions && <div className="mb-8">{customActions}</div>}
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
