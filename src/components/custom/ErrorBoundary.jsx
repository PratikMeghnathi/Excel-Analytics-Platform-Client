import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        console.log('Error in getDerivedStateFromError', error)
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.log("Chart rendering error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-400">
                        Chart could not be rendered
                    </h3>
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                        There was a problem displaying the chart. This could be due to incompatible data types
                        or configuration. Try selecting different columns or chart types.
                    </p>
                    <button
                        className="mt-3 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded"
                        onClick={() => this.setState({ hasError: false, error: null })}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;