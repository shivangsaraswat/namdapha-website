export type UserRole = 'super-admin' | 'secretary' | 'deputy-secretary' | 'web-admin' | 'coordinator';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthSession {
  user: User;
  expires: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details?: string;
  timestamp: Date;
  ipAddress?: string;
}

export const ROLE_PERMISSIONS = {
  'super-admin': ['*'], // All permissions
  'secretary': ['dashboard', 'events', 'resource-hub', 'council', 'teams', 'certificates'],
  'deputy-secretary': ['dashboard', 'events', 'resource-hub', 'teams'],
  'web-admin': ['dashboard', 'resource-hub', 'link-tree', 'forms'],
  'coordinator': ['dashboard', 'events', 'teams']
} as const;