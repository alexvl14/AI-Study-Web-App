import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors anywhere in the tree and shows a styled fallback
 * instead of a blank white screen. Class component because React error
 * boundaries have no hook equivalent.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught render error:', error, info);
    }
  }

  handleReload = () => {
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface px-6">
        <div className="bg-white etched-border shadow-hard p-10 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-5xl text-primary">sentiment_dissatisfied</span>
          <h1 className="font-serif text-headline-md text-on-surface mt-4">Something went wrong</h1>
          <p className="font-sans text-body-md text-on-surface-variant mt-2">
            The app hit an unexpected error. Reloading usually fixes it.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-6 bg-primary-container text-on-primary-container px-8 py-3 etched-border shadow-hard btn-press font-sans font-bold text-sm uppercase tracking-widest"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
