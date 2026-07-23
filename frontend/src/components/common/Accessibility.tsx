import React from 'react';

/**
 * SkipLink — Accessibility skip navigation link
 * 
 * ACCESSIBILITY: Allows keyboard users to skip directly to main content,
 * bypassing the navigation menu. Hidden visually but available to screen readers
 * and keyboard users (appears on focus).
 * 
 * WCAG 2.1 AA — 2.4.1 Bypass Blocks
 */
export const SkipLink: React.FC<{ targetId?: string }> = ({ targetId = 'main-content' }) => (
  <a
    href={`#${targetId}`}
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-bold focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
    aria-label="Skip to main content"
  >
    Skip to main content
  </a>
);

/**
 * FocusTrap — Traps focus within a container (for modals/drawers)
 * 
 * ACCESSIBILITY: Ensures keyboard users cannot tab outside of modal dialogs.
 * WCAG 2.1 AA — 2.1.2 No Keyboard Trap (controlled trap with escape)
 */
export const FocusTrap: React.FC<{
  children: React.ReactNode;
  active: boolean;
  onEscape?: () => void;
}> = ({ children, active, onEscape }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableElements = container.querySelectorAll(focusableSelectors);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus first element on mount
    const focusableElements = container.querySelectorAll(focusableSelectors);
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, onEscape]);

  return (
    <div ref={containerRef} role="dialog" aria-modal={active ? 'true' : undefined}>
      {children}
    </div>
  );
};

/**
 * VisuallyHidden — Visually hidden but accessible to screen readers.
 * 
 * ACCESSIBILITY: For descriptive text that should be read by screen readers
 * but not shown visually.
 */
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

/**
 * LiveRegion — Announces dynamic content changes to screen readers.
 * 
 * ACCESSIBILITY: WCAG 2.1 AA — 4.1.3 Status Messages
 */
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
}> = ({ children, priority = 'polite' }) => (
  <div aria-live={priority} aria-atomic="true" className="sr-only">
    {children}
  </div>
);
