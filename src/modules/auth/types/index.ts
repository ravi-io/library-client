export type UserRole = 'student' | 'librarian' | 'library_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
