// Défines all Activities routes
const ANIMATOR_ENDPOINT = "/api/animators";

export const ANIMATOR_API = {
  // List all animators
  animators: `${ANIMATOR_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  animatorById: (animatorId: string): string =>
    `${ANIMATOR_ENDPOINT}/${animatorId}`,
};