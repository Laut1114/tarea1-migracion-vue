export interface User {
  id: number,
  firstname: string,
  lastname: string,
  usuario: string,
  contra: string,
  remember?: boolean,
  isAdmim: boolean,
  token?: string,
  refreshToken: string[]
}
