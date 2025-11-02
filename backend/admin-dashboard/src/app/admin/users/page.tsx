"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import { UserRole } from "@/types/auth";
import { Plus, Shield, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getAllAuthorizedUsers, addAuthorizedUser, removeAuthorizedUser, toggleUserStatus } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PermissionsDialog from "@/components/PermissionsDialog";
import { DeletePermissions } from "@/lib/userService";
import { Key } from "lucide-react";

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["coordinator", "web-admin", "deputy-secretary", "secretary", "super-admin"]),
});

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  deletePermissions?: DeletePermissions;
  lastLogin?: Date;
  createdAt: Date;
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const loadUsers = async () => {
      const authUsers = await getAllAuthorizedUsers();
      // Sort users: super-admin first, then by role
      const sortedUsers = authUsers.sort((a, b) => {
        const aRole = (a as { role?: string }).role || '';
        const bRole = (b as { role?: string }).role || '';
        if (aRole === 'super-admin' && bRole !== 'super-admin') return -1;
        if (aRole !== 'super-admin' && bRole === 'super-admin') return 1;
        return aRole.localeCompare(bRole);
      });
      
      const formattedUsers = sortedUsers.map((authUser, index) => {
        const user = authUser as { email: string; role?: string; isActive?: boolean; lastLogin?: Date; createdAt?: Date };
        const userRole = user.role || 'coordinator';
        return {
          id: (index + 1).toString(),
          email: user.email,
          name: user.email === currentUser?.email ? currentUser.name : user.email.split('@')[0],
          role: userRole as UserRole,
          isActive: user.isActive ?? true,
          deletePermissions: (user as { deletePermissions?: DeletePermissions }).deletePermissions,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt || new Date("2024-01-01"),
        };
      });
      setUsers(formattedUsers);
    };
    loadUsers();
  }, [currentUser]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [permissionsDialog, setPermissionsDialog] = useState<{ open: boolean; user?: User }>({ open: false });
  
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "coordinator",
    },
  });

  const handleAddUser = async (values: z.infer<typeof userSchema>) => {
    await addAuthorizedUser(values.email, values.role as UserRole, true);
    
    const user: User = {
      id: Date.now().toString(),
      email: values.email,
      name: values.name,
      role: values.role as UserRole,
      isActive: true,
      createdAt: new Date(),
    };
    setUsers([...users, user]);
    form.reset();
    setShowAddUser(false);
  };

  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await toggleUserStatus(user.email);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await removeAuthorizedUser(user.email);
      setUsers(users.filter(u => u.id !== userId));
    }
  };
  
  const formatLastLogin = (lastLogin?: Date) => {
    if (!lastLogin) return 'Never';
    
    return lastLogin.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      'super-admin': 'bg-purple-100 text-purple-800',
      'secretary': 'bg-blue-100 text-blue-800',
      'deputy-secretary': 'bg-indigo-100 text-indigo-800',
      'web-admin': 'bg-green-100 text-green-800',
      'coordinator': 'bg-yellow-100 text-yellow-800',
    };
    return colors[role];
  };

  return (
    <AuthGuard requiredPermission="*">
      <PageLayout title="User Management" subtitle="Manage user access and permissions" activeItem="User Management">
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddUser(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Total Users</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{users.length}</p>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Active Users</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-purple-600" />
                <div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Recent Logins</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {users.filter(u => u.lastLogin).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add User Modal */}
          {showAddUser && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 min-h-screen">
              <div className={`p-8 rounded-2xl w-full max-w-md shadow-2xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
                <h3 className={`text-xl font-bold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Add New User</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Role
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="coordinator">Coordinator</SelectItem>
                              <SelectItem value="web-admin">Web Admin</SelectItem>
                              <SelectItem value="deputy-secretary">Deputy Secretary</SelectItem>
                              <SelectItem value="secretary">Secretary</SelectItem>
                              <SelectItem value="super-admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 mt-6">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
                      >
                        Add User
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddUser(false)}
                        className={`flex-1 px-4 py-3 border rounded-xl transition-all font-medium ${
                          isDarkMode 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}

          <PermissionsDialog
            open={permissionsDialog.open}
            onOpenChange={(open) => setPermissionsDialog({ open })}
            userEmail={permissionsDialog.user?.email || ''}
            userName={permissionsDialog.user?.name || ''}
            currentPermissions={permissionsDialog.user?.deletePermissions}
          />

          {/* Users Table */}
          <div className={`rounded-lg border overflow-hidden ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      User
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Role
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Last Login
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDarkMode ? 'bg-gray-700 divide-gray-600' : 'bg-white divide-gray-200'
                }`}>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.name}
                          </div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatLastLogin(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {user.role !== 'super-admin' && currentUser?.role === 'super-admin' && (
                            <>
                              <button
                                onClick={() => setPermissionsDialog({ open: true, user })}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                                title="Manage delete permissions"
                              >
                                <Key className="w-3 h-3" />
                                Permissions
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`px-3 py-1 text-xs rounded transition-colors ${
                                  user.isActive 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                                title={user.isActive ? 'Prevent user from logging in' : 'Allow user to login'}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {user.role === 'super-admin' && (
                            <span className="px-3 py-1 text-xs text-gray-500 italic">
                              Always Active
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}