import { UserRoles } from "./commonTypes";

export interface User {
    role: UserRoles
    authToken?: string;
}
