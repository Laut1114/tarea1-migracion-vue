export { fakeBackend };

import type { User } from "@/models/user";
import type { JwtPayload } from "@/models/jwtModel";
import type { AuthReqBody } from "@/models/authReqModel";

// Array de usuarios en localstorage
const usersKey = 'vue-3-jwt-refresh-token-users';
const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');

// Agregar un usuario test en localstorage si no hay ninguno
const user: User = {
    id: 1,
    firstname: 'Matias',
    lastname: 'Orellana',
    usuario: 'test',
    contra: 'test',
    isAdmin: true,
    refreshTokens: []
}

// Si no hay usuarios creamos uno y lo guardamos en almacenamiento local
if (!users.length) {
    users.push(user);
    localStorage.setItem(usersKey, JSON.stringify(users));
}

function fakeBackend() {
    const realFetch = window.fetch;

    window.fetch = function(url, opts: any) : Promise<Response> {
        return new Promise((resolve, reject) => {
            // Envolvemos la funcion en un setTimeout para simular una llamada a API
            setTimeout(handleRoute, 1000);

            // Manejamos las rutas falsas como si hicieramos llamados api
            function handleRoute() {
                const { method } = opts;
                switch (true){
                    case url.toString().endsWith('/users/authenticate') && method === 'POST':
                        return authenticate();
                    case url.toString().endsWith('/users/refresh-token') && method === 'POST':
                        return refreshToken();
                    case url.toString().endsWith('/users/revoke-token') && method === 'POST':
                        return revokeToken();
                    case url.toString().endsWith('/users') && method === 'GET':
                        return getUsers();
                    default:
                        // Llegamos aca si ninguno de los casos de arriba corresponden
                        return realFetch(url, opts).then(res => resolve(res)).catch(error => reject(error))
                }
            }

            // Funciones de rutas

            function authenticate() {
                const { username, password } = body<AuthReqBody>();
                const user = users.find(x => x.usuario === username && x.contra === password);

                if (!user) return error('Usuario o contraseña incorrectos');

                // Agregar refresh token al usuario
                user.refreshTokens.push(generateRefreshToken());
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.usuario,
                    firstname: user.firstname,
                    lastName: user.lastname,
                    isAdmin: user.isAdmin,
                    jwToken: generateJwToken()
                });
            }

            function refreshToken() {
                const refreshToken = getRefreshToken();
                if (!refreshToken) return unauthorized();

                const user = users.find(x => x.refreshTokens.includes(refreshToken));
                if (!user) return unauthorized();

                // Reemplazar refresh token viejo por uno nuevo y guardar
                user.refreshTokens = user.refreshTokens.filter(x => x !== refreshToken);
                user.refreshTokens.push(generateRefreshToken());
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.usuario,
                    firstname: user.firstname,
                    lastName: user.lastname,
                    isAdmin: user.isAdmin,
                    jwToken: generateJwToken()
                });
            }

            function revokeToken() {
                if (!isLoggedIn()) return unauthorized();

                const refreshToken = getRefreshToken();
                const _user = users.find(x => x.refreshTokens.includes(refreshToken));

                // Revocar token y guardar en almacenamiento local
                if (_user !== undefined) {
                    _user.refreshTokens = _user.refreshTokens.filter(x => x !== refreshToken);
                    localStorage.setItem(usersKey, JSON.stringify(users));
                }

                return ok({ msg: 'Token revocado' })
            }

            // Funciona para obtener usuarios, controla si el usuario está logeado
            function getUsers() {
                if (!isLoggedIn()) return unauthorized();
                return ok(users);
            }

            // Funciones Auxiliares

            function ok(body: any) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) } as Response);
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ msg: 'Sin Autorización' })) } as Response);
            }

            function error(msg: string) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ msg })) } as Response);
            }

            function isLoggedIn(): boolean {
                // Chequea si el JwT esta en el auth header
                const authHeader = opts.headers?.['Authorization'] || '';
                if (!authHeader.startsWith('Bearer fake-jwt-token')) return false;

                // Chequea si el token expiro
                try {
                    const jwToken = JSON.parse(atob(authHeader.split('.')[1])) as JwtPayload;
                    const tokenExpired = Date.now() > jwToken.exp * 1000;
                    if (tokenExpired) return false;
                } catch {
                    return false;
                }

                return true;
            }

            function body<T>(): T {
                return opts.body ? JSON.parse(opts.body) : {} as T;
            }

            function generateJwToken(): string {
                // Crea token que expira en 2 minutos
                const tokenPayload: JwtPayload = { exp: Math.round(Date.now() / 1000 + 2 * 60) };
                const fakeJwToken: string = `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;

                return fakeJwToken;
            }

            function generateRefreshToken(): string {
                const token: string = new Date().getTime().toString();
                // Agregar un refresh token que expira en 7 dias
                const expires: string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

                document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

                return token;
            }

            function getRefreshToken(): string {
                // Obtener el refresh token de la cookie
                return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
            }
        })
    }
}
