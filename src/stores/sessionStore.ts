import { defineStore } from 'pinia';
import type { UserSessionState } from '@/models/sessionStateModel';

export const useSessionStore = defineStore('session', {
    state: (): UserSessionState => ({
        loading: false,
        data: {
            payload: '',
            tokenCreated: null,
            tokenExpire: null,
            tokenRefresh: null
        }
    }),
    actions: {
        update(freshData: UserSessionState) {
            this.loading = freshData.loading;
            this.data.payload = freshData.data.payload;
            this.data.tokenCreated = freshData.data.tokenCreated;
            this.data.tokenExpire = freshData.data.tokenExpire;
            this.data.tokenRefresh = freshData.data.tokenRefresh;
            
            setTimeout(() => {this.loading = false}, 800);
        }
    }
});
