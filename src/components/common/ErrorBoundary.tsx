import React, { Component, ErrorInfo } from 'react';

/**
 * ErrorBoundary — Catches React render errors gracefully.
 * 
 * Prevents the entire app from crashing with a white screen.
 * RELIABILITY: Ensures system stability even when components fail.
 */

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;

      return (
        <div
          className="glass-panel rounded-3xl p-8 text-center space-y-4 animate-in fade-in duration-500 max-w-lg mx-auto mt-12"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto">
            <span className="text-2xl" role="img" aria-label="Error occurred">⚠️</span>
          </div>
          <h3 className="font-display text-lg font-extrabold text-indigo-950">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            An unexpected error occurred. Please try refreshing the page or click the button below to recover.
          </p>
          {this.state.error && (
            <details className="text-left text-xs text-gray-400 bg-gray-50 rounded-xl p-3 mt-2">
              <summary className="cursor-pointer font-bold text-gray-500">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono">{this.state.error.message}</pre>
            </details>
          )}
          <button
            onClick={this.handleReset}
            className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            aria-label="Try again to recover from error"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
