import { Observable } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    // public jwt$!: Observable<string>;
    constructor(private jwtService: JwtService, private router: Router) { }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // this.jwtService.OnInit();

        // this.jwtService.getJwt().subscribe(data => {
        //     if (data != '') {

        //         return true;

        //     } else {
        //         console.log('not logged In')

        //         return false;
        //     }
        // });

        // return false;
        return this.jwtService.getToken() != null


    }
}