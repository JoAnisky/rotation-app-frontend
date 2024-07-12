import { UserRoles } from "./commonTypes";

export interface User {
    userName?: string;
    userID?: number;
    role: UserRoles
    authToken?: string;
}

export interface UserInfos {
    username: string;
    user_id: number;
    role: string[];
    csrfToken: string;
  }