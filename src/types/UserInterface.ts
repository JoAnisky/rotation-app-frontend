import { UserRoles } from "./commonTypes";

export interface User {
    userName?: string;
    userID?: number;
    role: UserRoles
    authToken?: string;
}
