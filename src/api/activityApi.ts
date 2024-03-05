// Défines all Activities routes
const ACTIVITIES_ENDPOINT = "/api/activity";

export const ACTIVITIES_API = {
  // List all activities
  activities: `${ACTIVITIES_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  activityById: (activityId: string): string =>
    `${ACTIVITIES_ENDPOINT}/${activityId}`,
};
