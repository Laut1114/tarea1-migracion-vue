export interface UserSession {
    payload: string,
    tokenCreated: Date | null,
    tokenExpire: Date | null,
    tokenRefresh: Date | null
}
