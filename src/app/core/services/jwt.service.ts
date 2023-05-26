import { Injectable } from "@angular/core";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({ providedIn: "root" })
export class JwtService {

    //token storage service
    //first use localStorage for save data
    signOut() {
        window.localStorage.clear();
    }

    saveToken(token: string): void {
        window.localStorage[TOKEN_KEY] = token;
    }
    getToken(): string {
        return window.localStorage[TOKEN_KEY];
    }

    saveUser(user: any): void {
        window.localStorage.removeItem(USER_KEY);
        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getUser(): any {
        return JSON.parse(localStorage[USER_KEY]);
    }

    destroyToken(): void {
        window.localStorage.removeItem(TOKEN_KEY);
    }
}