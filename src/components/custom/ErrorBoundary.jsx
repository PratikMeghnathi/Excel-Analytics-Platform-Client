import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    console.log("Error in getDerivedStateFromError", error)
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.log("Chart rendering error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
          <h3 className="text-lg font-medium text-destructive mb-2">Chart could not be rendered</h3>
          <p className="text-sm text-destructive/80 mb-3">
            There was a problem displaying the chart. This could be due to incompatible data types or configuration. Try
            selecting different columns or chart types.
          </p>
          <button
            className="px-3 py-2 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-md text-sm transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
