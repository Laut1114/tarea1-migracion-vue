import type { UserSession } from "./sessionModel";

export interface UserSessionState {
    loading: boolean,
    data: UserSession
}
