"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import { ActivityLog } from "@/types/auth";
import { Clock, User, Activity, Filter } from "lucide-react";

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");

  useEffect(() => {
    // Mock data for demonstration
    const mockLogs: ActivityLog[] = [
      {
        id: "1",
        userId: "admin@namdapha.org",
        action: "LOGIN",
        details: "Successful login",
        timestamp: new Date(),
        ipAddress: "192.168.1.1"
      },
      {
        id: "2",
        userId: "secretary@namdapha.org",
        action: "CREATE_EVENT",
        details: "Created new event: Annual Conference",
        timestamp: new Date(Date.now() - 3600000),
        ipAddress: "192.168.1.2"
      },
      {
        id: "3",
        userId: "web-admin@namdapha.org",
        action: "UPDATE_RESOURCE",
        details: "Updated resource hub content",
        timestamp: new Date(Date.now() - 7200000),
        ipAddress: "192.168.1.3"
      }
    ];
    
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;
    
    if (filterUser) {
      filtered = filtered.filter(log => 
        log.userId.toLowerCase().includes(filterUser.toLowerCase())
      );
    }
    
    if (filterAction) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(filterAction.toLowerCase())
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, filterUser, filterAction]);

  const getActionColor = (action: string) => {
    const colors = {
      'LOGIN': 'bg-green-100 text-green-800',
      'LOGOUT': 'bg-gray-100 text-gray-800',
      'CREATE': 'bg-blue-100 text-blue-800',
      'UPDATE': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
    };
    
    for (const [key, color] of Object.entries(colors)) {
      if (action.includes(key)) return color;
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <AuthGuard requiredPermission="*">
      <PageLayout title="Activity Logs" activeItem="Activity Logs">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
              <p className="text-gray-600">Monitor user activities and system events</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(logs.map(log => log.userId)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Today&apos;s Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => 
                      log.timestamp.toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Filter by user..."
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Filter by action..."
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.timestamp.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.details || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No activity logs found</p>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}