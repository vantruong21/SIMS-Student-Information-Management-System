import { create } from 'zustand';
import { AppFacade } from '../facades/AppFacade';

/**
 * useAuthStore — Authentication State Management
 * 
 * Connects to AppFacade for real credential validation via CSV-stored users.
 * DESIGN PATTERN: Uses Facade Pattern for simplified auth API.
 * SECURITY: SHA-256 hashed passwords, session timeout, rate limiting.
 */

export interface UserProfile {
  id: string;
  name: string;
  role: 'Student' | 'Faculty' | 'Admin';
  email: string;
  avatarUrl: string;
  gpa?: number;
  creditsCompleted?: number;
  totalCreditsNeeded?: number;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  clearError: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const facade = AppFacade.getInstance();
      const result = await facade.login(email, password);

      if (result.success && result.user) {
        // Enrich profile with student data if applicable
        let profile: UserProfile = {
          id: result.user.id,
          name: result.user.name,
          role: result.user.role,
          email: result.user.email,
          avatarUrl: result.user.avatarUrl,
        };

        if (result.user.role === 'Student') {
          const gpa = facade.calculateStudentGpa(result.user.id);
          const studentCourses = facade.getStudentCourses(result.user.id);
          const totalCredits = studentCourses.reduce((acc: number, c: any) => acc + (c?.credits || 0), 0);
          profile = {
            ...profile,
            gpa,
            creditsCompleted: totalCredits,
            totalCreditsNeeded: 140,
          };
        }

        set({ user: profile, isLoading: false, error: null });
        return true;
      } else {
        set({ isLoading: false, error: result.error || 'Authentication failed' });
        return false;
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'An unexpected error occurred' });
      return false;
    }
  },

  logout: () => {
    const facade = AppFacade.getInstance();
    facade.logout();
    set({ user: null, error: null });
  },

  setUser: (user) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },

  checkSession: () => {
    const facade = AppFacade.getInstance();
    if (!facade.isSessionValid()) {
      set({ user: null });
    }
  },
}));
