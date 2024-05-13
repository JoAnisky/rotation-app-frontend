import { API_BASE_URL } from "@/routes/api/apiBaseUrl";

// Défines all Stands routes
const STANDS_ENDPOINT = `${API_BASE_URL}/stands`;

export const STANDS_API = {
  // List all stands
  stands: `${STANDS_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  standById: (standId: string): string =>
    `${STANDS_ENDPOINT}/${standId}`,
};