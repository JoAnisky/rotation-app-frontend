// Défines all Activities routes
const ANIMATOR_ENDPOINT = "/api/animators";

export const ANIMATOR_API = {
  // List all animators
  animators: `${ANIMATOR_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  getAnimatorById: (animatorId: string |number): string => `${ANIMATOR_ENDPOINT}/${animatorId}`,
  // Set animator stands
  setAnimatorStands: (animatorId: string |number): string => `${ANIMATOR_ENDPOINT}/${animatorId}/stands`
};
