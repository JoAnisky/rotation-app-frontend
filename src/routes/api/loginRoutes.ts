import { API_BASE_URL } from "@/routes/api/apiBaseUrl";

const LOGIN_ENDPOINT = `${API_BASE_URL}`;

export const LOGIN_API = {
  /**
   * Gets userID with provided token
   */
  login: `${LOGIN_ENDPOINT}/api/login`,

  /**
   * Endpoint to check login credentials and get access token
   */
  loginCheck: `${LOGIN_ENDPOINT}/login_check`
  
};
