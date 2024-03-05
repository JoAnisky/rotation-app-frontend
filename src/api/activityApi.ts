// Défines all Activities routes
const ACTIVITIES_ENDPOINT = '/api/activities';

export const ACTIVITIES_API = {

    // List all activities
    getAllActivities: `${ACTIVITIES_ENDPOINT}`,

    // Get a single activity by ID (GET method)
    getActivityById: (activityId: string) => `${ACTIVITIES_ENDPOINT}/details/${activityId}`,

    // Create a new activity (POST method)
    createActivity: `${ACTIVITIES_ENDPOINT}/create`,

    // Delete an activity by ID (DELETE method)
    deleteActivity: (activityId: string) => `${ACTIVITIES_ENDPOINT}/delete/${activityId}`,

    // Update an activity by ID (PUT or PATCH method)
    updateActivity: (activityId: string) => `${ACTIVITIES_ENDPOINT}/update/${activityId}`,

};