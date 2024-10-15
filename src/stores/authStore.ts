import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import type { User } from '@/models/user';
import { useSessionStore } from './sessionStore';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        auth: {} as { 
            loading: boolean, 
            data: User | null, 
            refreshTokenTimeout: number | null 
        }
    }),
    actions: {
        async login(username: string, password: string) {
            this.auth.data = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password }, { credentials: 'include' });
            this.startRefreshTokenTimer();
        },

        logout() {
            fetchWrapper.post(`${baseUrl}/revoke-token`, {}, { credentials: 'include' });
            this.stopRefreshTokenTimer();
            this.auth.data = null;
        },

        async refreshToken() {
            this.auth.data = await fetchWrapper.post(`${baseUrl}/refresh-token`, {}, { credentials: 'include' });
            this.startRefreshTokenTimer();
        },

        startRefreshTokenTimer() {
            if (!this.auth.data || !this.auth.data.jwToken) return;

            const { update } = useSessionStore();

            // Parsear un objeto JSON de base64
            const jwtBase64 = this.auth.data.jwToken.split('.')[1];
            const decodedJwToken = JSON.parse(atob(jwtBase64));

            // Crear un Timeout para refrescar el token antes de que expire
            const expires = new Date(decodedJwToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            const refresh = new Date(Date.now() + timeout);

            update({'loading': true, 'data': { payload: jwtBase64, tokenCreated: new Date, tokenExpire: expires, tokenRefresh: refresh } })

            this.auth.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
        },

        stopRefreshTokenTimer() {
            if(this.auth.refreshTokenTimeout) {
                clearTimeout(this.auth.refreshTokenTimeout);
                this.auth.refreshTokenTimeout = null;
            }
        }
    }
})
