// Défines all Activities routes
const ACTIVITY_ENDPOINT = "/api/activity";

export const ACTIVITY_API = {
  // List all activities
  activities: `${ACTIVITY_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  activityById: (activityId: number | undefined): string =>
    `${ACTIVITY_ENDPOINT}/${activityId}`,
};
