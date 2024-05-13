import { UserRoles } from "./commonTypes";

export interface User {
    id?: number;
    role: UserRoles
    authToken?: string;
}
