import { AuthService } from '@/auth/authService';

export class SessionManager {
  // Get current user ID for backend requests
  static getUserId(): string | null {
    const user = AuthService.getCurrentUser();
    return user?.id || null;
  }

  // Get authorization headers for API requests
  static getAuthHeaders(): Record<string, string> {
    const userId = this.getUserId();
    return userId ? { 'X-User-ID': userId } : {};
  }

  // Add user ID to request payload
  static addUserContext<T extends Record<string, any>>(data: T): T & { userId: string } {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return { ...data, userId };
  }
}