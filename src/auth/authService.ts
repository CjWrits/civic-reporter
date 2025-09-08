import { STORAGE_KEYS } from '@/config/constants';

export type UserType = 'user' | 'admin';

export interface AuthUser {
  type: UserType;
  email?: string;
}

export class AuthService {
  static login(userType: UserType, email?: string): AuthUser {
    const user: AuthUser = { type: userType, email };
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return user;
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  static getCurrentUser(): AuthUser | null {
    const stored = localStorage.getItem(STORAGE_KEYS.user);
    return stored ? JSON.parse(stored) : null;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.type === 'admin';
  }

  static validateAdminCredentials(email: string, password: string): boolean {
    return email === 'admin@civic.com' && password === 'admin123';
  }
}