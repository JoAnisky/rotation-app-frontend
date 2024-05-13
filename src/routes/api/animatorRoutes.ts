import { API_BASE_URL } from "@/routes/api/apiBaseUrl";

// Défines all Activities routes
const ANIMATOR_ENDPOINT = `${API_BASE_URL}/animators`;

export const ANIMATOR_API = {
  // List all animators
  animators: `${ANIMATOR_ENDPOINT}`,

  // Get, Update, or Delete a single activity by ID (GET, PUT/PATCH, DELETE methods)
  getAnimatorById: (animatorId: string |number): string => `${ANIMATOR_ENDPOINT}/${animatorId}`,
  // Set animator stands
  setAnimatorStands: (animatorId: string |number): string => `${ANIMATOR_ENDPOINT}/${animatorId}/stands`
};
