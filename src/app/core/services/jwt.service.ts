import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({ providedIn: "root" })
export class JwtService {

    private token$ = new BehaviorSubject<string>('');
    //token storage service
    //first use localStorage for save data


    constructor(private router: Router) {


    }
    OnInit() {
        let token = localStorage.getItem(TOKEN_KEY);
        this.token$.next(token as string)
    }
    getJwt(): Observable<string> {
        return this.token$;
    }

    isLoggedIn(): any {

        // const token = localStorage.getItem(‘token’); // get token from local storage

        // const payload = atob(token.split(‘.’)[1]); // decode payload of token

        // const parsedPayload = JSON.parse(payload); // convert payload into an Object

        // return parsedPayload.exp > Date.now() / 1000; // check if token is expired

        return this.token$;

    }

    signOut() {
        window.localStorage.clear();
        this.router.navigate(["/"]);
    }

    saveToken(token: string): void {
        window.localStorage[TOKEN_KEY] = token;
    }
    getToken(): string {
        return window.localStorage[TOKEN_KEY];
    }
    decodeToken(token: string): any {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }
    saveUser(user: any): void {
        window.localStorage.removeItem(USER_KEY);
        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getUser(): any {
        if (localStorage[USER_KEY] != undefined) {
            return JSON.parse(localStorage[USER_KEY]);

        } else return null
    }

    destroyToken(): void {
        window.localStorage.removeItem(TOKEN_KEY);
    }
}