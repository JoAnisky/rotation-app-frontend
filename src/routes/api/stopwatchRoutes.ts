import { API_BASE_URL } from "@/routes/api/apiBaseUrl";

// Défines all Stopwatches routes
const STOPWATCH_ENDPOINT = `${API_BASE_URL}/stopwatch`;

export const STOPWATCH_API = {
  // List all stopwatches
  stopwatches: `${STOPWATCH_ENDPOINT}`,

  // Get, Update, or Delete a single stopwatch by ID (GET, PUT/PATCH, DELETE methods)
  stopwatchById: (stopwatchId: string): string =>
    `${STOPWATCH_ENDPOINT}/${stopwatchId}`,
};