// Défines all Activities routes
const SCENARIO_ENDPOINT = "/api/scenario";

export const SCENARIO_API = {
  // List all activities
  scenarios: `${SCENARIO_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  scenarioByActivityId: (activityId: string): string =>
    `${SCENARIO_ENDPOINT}/${activityId}`,
};
