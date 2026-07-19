import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../models/User';

/**
 * withAuth — Higher-Order Component for Route Protection
 * 
 * DESIGN PATTERN: Decorator Pattern
 * Wraps a component with authentication and role-based access control.
 * The wrapped component only renders if the user is authenticated
 * and has one of the allowed roles.
 * 
 * SOLID — Open/Closed: New role restrictions can be added without modifying components.
 * SOLID — Single Responsibility: Auth checking is separated from component logic.
 */

interface WithAuthOptions {
  /** Roles allowed to access this component. Empty = any authenticated user. */
  allowedRoles?: UserRole[];
  /** Custom component to render when unauthorized. */
  fallback?: React.ComponentType;
}

/**
 * Default unauthorized fallback component.
 */
const DefaultUnauthorized: React.FC = () => (
  <div
    className="glass-panel rounded-3xl p-8 text-center space-y-4 animate-in fade-in duration-500"
    role="alert"
    aria-live="assertive"
  >
    <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto">
      <span className="text-2xl" role="img" aria-label="Restricted">🔒</span>
    </div>
    <h3 className="font-display text-lg font-extrabold text-indigo-950">
      Access Restricted
    </h3>
    <p className="text-sm text-gray-500 max-w-md mx-auto">
      You do not have the required permissions to access this section.
      Please contact your system administrator if you believe this is an error.
    </p>
  </div>
);

/**
 * Default login required fallback component.
 */
const DefaultLoginRequired: React.FC = () => (
  <div
    className="glass-panel rounded-3xl p-8 text-center space-y-4 animate-in fade-in duration-500"
    role="alert"
    aria-live="assertive"
  >
    <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
      <span className="text-2xl" role="img" aria-label="Login required">🔐</span>
    </div>
    <h3 className="font-display text-lg font-extrabold text-indigo-950">
      Authentication Required
    </h3>
    <p className="text-sm text-gray-500 max-w-md mx-auto">
      Please sign in to access this feature.
    </p>
  </div>
);

/**
 * HOC: Wraps a component with auth checks.
 * 
 * Usage:
 *   const ProtectedAdmin = withAuth(AdminDashboard, { allowedRoles: ['Admin'] });
 *   const ProtectedAny = withAuth(Dashboard); // any logged-in user
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
): React.FC<P> {
  const { allowedRoles = [], fallback: FallbackComponent } = options;

  const WithAuthComponent: React.FC<P> = (props) => {
    const user = useAuthStore(state => state.user);

    // Not authenticated
    if (!user) {
      if (FallbackComponent) return <FallbackComponent />;
      return <DefaultLoginRequired />;
    }

    // Role check (if roles specified)
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as UserRole)) {
      if (FallbackComponent) return <FallbackComponent />;
      return <DefaultUnauthorized />;
    }

    // Authorized — render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Set display name for React DevTools
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuthComponent.displayName = `withAuth(${wrappedName})`;

  return WithAuthComponent;
}

/**
 * RouteGuard — Component wrapper for role-based rendering.
 * Alternative to HOC for inline usage in JSX.
 * 
 * Usage:
 *   <RouteGuard allowedRoles={['Admin', 'Faculty']}>
 *     <SensitiveContent />
 *   </RouteGuard>
 */
export const RouteGuard: React.FC<{
  allowedRoles?: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ allowedRoles = [], children, fallback }) => {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return <>{fallback || <DefaultLoginRequired />}</>;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as UserRole)) {
    return <>{fallback || <DefaultUnauthorized />}</>;
  }

  return <>{children}</>;
};
