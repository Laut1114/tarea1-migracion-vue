export { fakeBackend };

import type { User } from "@/models/user";
import type { JwtPayload } from "@/models/jwtModel";
import type { AuthReqBody } from "@/models/authReqModel";

const userKey = 'vue-3-jwt-refresh-token-users';
const users : User[] = JSON.parse(localStorage.getItem(userKey) || '');

// Agregar un usuario para pruebas
const user: User = {
    id: 1,
    firstname: 'Matias',
    lastname: 'Orellana',
    usuario: 'test',
    contra: 'test',
    isAdmim: true,
    refreshToken: []
}

if (!users.length) {
    users.push(user);
    localStorage.setItem(userKey, JSON.stringify(users));
}

function fakeBackend() {
    const realFetch = window.fetch;

    window.fetch = function(url, opts: any) : Promise<Response> {
        return new Promise((resolve, reject) => {
            setTimeout(handleRoute, 1000);

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
                        // Pass through any request not handled above
                        return realFetch(url, opts).then(res => resolve(res)).catch(error => reject(error))
                }
            }

            function authenticate() {
                const { username, password } = body<AuthReqBody>();
                const user = users.find(x => x.usuario === username && x.contra === password);

                if (!user) return error('Usuario o Contraseña incorrectos');

                // Agregar refresh token al usuario
                user.refreshToken.push(generateRefreshToken());
                localStorage.setItem(userKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.usuario,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    isAdmin: user.isAdmim,
                    jwToken: generateJwToken()
                });
            }

            // funciones Auxiliares
            function ok(body: any) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) } as Response);
            }

            function error(msg: string) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ msg })) } as Response);
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
        })
    }
}
