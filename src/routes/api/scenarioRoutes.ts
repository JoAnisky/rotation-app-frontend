import { API_BASE_URL } from "@/routes/api/apiBaseUrl";

// Défines all Scenario routes
const SCENARIO_ENDPOINT = `${API_BASE_URL}/scenario`;

export const SCENARIO_API = {
  // List all activities
  scenarios: `${SCENARIO_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  getScenarioById: (scenarioId: number | string): string => `${SCENARIO_ENDPOINT}/${scenarioId}`,

  // Get scenario by activityID
  getScenarioByActivityId: (activityId: number | string): string => `${SCENARIO_ENDPOINT}/${activityId}`
};
