import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { NetworkErrorBoundary } from './components/NetworkErrorBoundary';

/**
 * Application Entry Point
 * 
 * Wraps the entire app in an ErrorBoundary for reliability.
 * RELIABILITY: Graceful error handling prevents white-screen crashes.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
