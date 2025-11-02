import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserRole } from "@/types/auth";
import { logActivity } from "@/lib/activityLogger";
import { getUserData, updateLastLogin, createUser, getAllUsers, addUser, removeUser, updateUser, toggleUser } from "@/lib/userService";

// Default authorized users - will be migrated to Firebase
const defaultUsers = {
  "shivangk512@gmail.com": { role: "super-admin" as UserRole, isActive: true },
  "hacksprint01@gmail.com": { role: "secretary" as UserRole, isActive: true },
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Default 24 hours, will be overridden per user
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After sign in, redirect to dashboard
      if (url.startsWith(baseUrl)) return `${baseUrl}/dashboard`;
      else if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        let userData = await getUserData(user.email!);
        
        // Create user if doesn't exist and is in default users
        if (!userData && defaultUsers[user.email! as keyof typeof defaultUsers]) {
          const defaultUser = defaultUsers[user.email! as keyof typeof defaultUsers];
          await createUser(user.email!, defaultUser.role, defaultUser.isActive);
          userData = await getUserData(user.email!);
        }
        
        if (!userData) {
          logActivity(user.email!, "LOGIN_FAILED", "Unauthorized access attempt");
          return "/auth/error?error=Unauthorized";
        }
        if (!userData.isActive) {
          logActivity(user.email!, "LOGIN_FAILED", "Inactive user access attempt");
          return "/auth/error?error=AccessRevoked";
        }
        
        await updateLastLogin(user.email!);
        logActivity(user.email!, "LOGIN_SUCCESS", `Successful login as ${userData.role}`);
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        const userData = await getUserData(user.email!);
        token.role = userData?.role;
        token.isActive = userData?.isActive;
        token.email = user.email;
      }
      
      // Check if user is still active on each request
      if (token.email) {
        const userData = await getUserData(token.email as string);
        if (!userData || !userData.isActive) {
          token.isActive = false; // Mark as inactive instead of returning null
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as { role?: string; isActive?: boolean }).role = token.role as string;
        (session.user as { role?: string; isActive?: boolean }).isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signOut({ token }) {
      if (token?.email) {
        logActivity(token.email as string, "LOGOUT", "User signed out");
      }
    },
  },
};

export function hasPermission(userRole: UserRole, requiredPermission: string): boolean {
  // All authenticated users have access to all dashboard pages
  const allUserPermissions = ['dashboard', 'events', 'resource-hub', 'council', 'teams', 'certificates', 'link-tree', 'forms'];
  
  // Super admin has access to everything including user management
  if (userRole === 'super-admin') {
    return true;
  }
  
  // All other users have access to all dashboard pages except user management
  return allUserPermissions.includes(requiredPermission);
}



// Helper functions for user management (Super Admin only)
export async function getAllAuthorizedUsers() {
  return await getAllUsers();
}

export async function addAuthorizedUser(email: string, role: UserRole, isActive: boolean = true) {
  await addUser(email, role, isActive);
}

export async function removeAuthorizedUser(email: string) {
  await removeUser(email);
}

export async function updateUserRole(email: string, role: UserRole) {
  await updateUser(email, { role });
}

export async function toggleUserStatus(email: string) {
  await toggleUser(email);
}
