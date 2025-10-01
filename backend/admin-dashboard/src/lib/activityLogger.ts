import { ActivityLog } from "@/types/auth";

// Mock storage - replace with actual database
let activityLogs: ActivityLog[] = [];

export function logActivity(
  userId: string,
  action: string,
  details?: string,
  ipAddress?: string
): void {
  const log: ActivityLog = {
    id: Date.now().toString(),
    userId,
    action,
    details,
    timestamp: new Date(),
    ipAddress,
  };
  
  activityLogs.unshift(log); // Add to beginning
  
  // Keep only last 1000 logs
  if (activityLogs.length > 1000) {
    activityLogs = activityLogs.slice(0, 1000);
  }
}

export function getActivityLogs(limit?: number): ActivityLog[] {
  return limit ? activityLogs.slice(0, limit) : activityLogs;
}

export function getUserActivityLogs(userId: string, limit?: number): ActivityLog[] {
  const userLogs = activityLogs.filter(log => log.userId === userId);
  return limit ? userLogs.slice(0, limit) : userLogs;
}