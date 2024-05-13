import { API_BASE_URL } from "@/routes/api/apiBaseUrl";

// Défines all Activities routes
const ACTIVITY_ENDPOINT = `${API_BASE_URL}/activity`;

export const ACTIVITY_API = {
  // List all activities
  activities: `${ACTIVITY_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  getActivityById: (activityId: number | string): string => `${ACTIVITY_ENDPOINT}/${activityId}`,

  // Get stands for a single activity by ID
  getActivityStands: (activityId: number | string): string => `${ACTIVITY_ENDPOINT}/${activityId}/stands`,

  // Get teams for a single activity by ID
  getActivityTeams: (activityId: number | string): string => `${ACTIVITY_ENDPOINT}/${activityId}/teams`,

  // Get activity and user role (participant or animator) by PIN Code 
  getActivityAndRoleByPinCode: (role: string, pincode: string): string => `${ACTIVITY_ENDPOINT}/${role}/code/${pincode}`
};
