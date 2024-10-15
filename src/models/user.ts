export interface User {
  id: number,
  firstname: string,
  lastname: string,
  usuario: string,
  contra: string,
  remember?: boolean,
  isAdmin: boolean,
  jwToken?: string,
  refreshTokens: string[]
}
