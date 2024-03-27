// Défines all Activities routes
const STANDS_ENDPOINT = "/api/stands";

export const STANDS_API = {
  // List all stands
  stands: `${STANDS_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  animatorById: (standId: string): string =>
    `${STANDS_ENDPOINT}/${standId}`,
};