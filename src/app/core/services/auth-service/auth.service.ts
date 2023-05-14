import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { User } from '../../models/user.model';

import { environment } from 'environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    // return this.http.post<User>(`${environment.apiUrl}/users`, { username, password })
    //   .pipe(map(user => {
    //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem('user', JSON.stringify(user));
    //     this.userSubject.next(user);
    //     return user;
    //   }));
    let fakeUser: User = {
      id: '1',
      username: 'rocket',
      password: '123',
      firstName: 'Rocket',
      lastName: 'Nguyen',
      token: '1234567-1234567'



    }
    if (fakeUser.username === username && fakeUser.password === password) {
      localStorage.setItem('user', JSON.stringify(fakeUser))
      this.userSubject.next(fakeUser);
      return fakeUser;
    } else return null
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // register(user: User) {
  //   return this.http.post(`${environment.apiUrl}/users/register`, user);
  // }

  // getAll() {
  //   return this.http.get<User[]>(`${environment.apiUrl}/users`);
  // }

  // getById(id: string) {
  //   return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  // }

  // update(id: string, params: any) {
  //   return this.http.put(`${environment.apiUrl}/users/${id}`, params)
  //     .pipe(map(x => {
  //       // update stored user if the logged in user updated their own record
  //       if (id == this.userValue?.id) {
  //         // update local storage
  //         const user = { ...this.userValue, ...params };
  //         localStorage.setItem('user', JSON.stringify(user));

  //         // publish updated user to subscribers
  //         this.userSubject.next(user);
  //       }
  //       return x;
  //     }));
  // }

  // delete(id: string) {
  //   return this.http.delete(`${environment.apiUrl}/users/${id}`)
  //     .pipe(map(x => {
  //       // auto logout if the logged in user deleted their own record
  //       if (id == this.userValue?.id) {
  //         this.logout();
  //       }
  //       return x;
  //     }));
  // }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/