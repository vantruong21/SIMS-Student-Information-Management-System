/**
 * EventBus — Centralized Event System
 * 
 * DESIGN PATTERN: Observer Pattern
 * Allows components to subscribe to and publish events without
 * direct coupling between event producers and consumers.
 * 
 * SOLID — Single Responsibility: Only manages event pub/sub.
 * SOLID — Open/Closed: New event types can be added without modifying EventBus.
 */

type EventCallback = (...args: any[]) => void;

export class EventBus {
  /**
   * DESIGN PATTERN: Singleton Pattern
   * Ensures only one EventBus instance exists in the application.
   */
  private static _instance: EventBus | null = null;

  private listeners: Map<string, Set<EventCallback>>;

  private constructor() {
    this.listeners = new Map();
  }

  /**
   * Returns the singleton EventBus instance.
   */
  public static getInstance(): EventBus {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }
    return EventBus._instance;
  }

  /**
   * Subscribes a callback to an event type.
   * Returns an unsubscribe function.
   */
  public subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(event, callback);
    };
  }

  /**
   * Unsubscribes a callback from an event type.
   */
  public unsubscribe(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Publishes an event, notifying all subscribed observers.
   */
  public publish(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`[EventBus] Error in handler for event '${event}':`, error);
        }
      });
    }
  }

  /**
   * Checks if an event has any subscribers.
   */
  public hasSubscribers(event: string): boolean {
    return (this.listeners.get(event)?.size ?? 0) > 0;
  }

  /**
   * Removes all subscribers for a specific event.
   */
  public clearEvent(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Removes all subscribers for all events.
   */
  public clearAll(): void {
    this.listeners.clear();
  }

  /**
   * Resets the singleton (useful for testing).
   */
  public static resetInstance(): void {
    if (EventBus._instance) {
      EventBus._instance.clearAll();
    }
    EventBus._instance = null;
  }
}

// --- Predefined Event Types ---
export const AppEvents = {
  // Authentication events
  USER_LOGGED_IN: 'auth:login',
  USER_LOGGED_OUT: 'auth:logout',
  SESSION_EXPIRED: 'auth:session_expired',
  LOGIN_FAILED: 'auth:login_failed',

  // Student events
  STUDENT_REGISTERED: 'student:registered',
  STUDENT_APPROVED: 'student:approved',
  STUDENT_DELETED: 'student:deleted',
  STUDENT_IMPORTED: 'student:imported',

  // Course events
  COURSE_CREATED: 'course:created',
  COURSE_UPDATED: 'course:updated',
  COURSE_DELETED: 'course:deleted',
  STUDENT_ENROLLED: 'course:student_enrolled',
  STUDENT_UNENROLLED: 'course:student_unenrolled',

  // Grade events
  GRADE_UPDATED: 'grade:updated',

  // Notification events
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_CLEAR: 'notification:clear',

  // Data events
  DATA_EXPORTED: 'data:exported',
  DATA_IMPORTED: 'data:imported',
} as const;
