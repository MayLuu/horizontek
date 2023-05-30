import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { User } from 'src/app/core/models/user.model';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = false;

  isLoggedIn = false;
  isLoginFailed = false;

  constructor(

    public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,

    private authService: AuthService,
    private tokenStorage: JwtService


  ) {
    // this.message = this.getMessage();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    //snackbar here

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    // this.authService.login(this.f.username.value, this.f.password.value)
    //   .pipe(first())
    //   .subscribe({
    //     next: () => {
    //       // get return url from query parameters or default to home page
    //       const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //       this.router.navigateByUrl(returnUrl);
    //     },
    //     error: error => {
    //       this.alertService.error(error);
    //       this.loading = false;
    //     }
    //   });
    // const user = this.authService.login(this.f['username'].value, this.f['password'].value)
    // if (user == null) {
    //   this.error = true;
    //   this.router.navigateByUrl('/login');
    // } else {
    //   this.router.navigateByUrl('/')
    // }
    // console.log(this.authService.login(this.f['username'].value, this.f['password'].value));

    let form = {
      username: this.f['username'].value,
      password: this.f['password'].value
    }
    console.log('login user:', form)

    this.authService.login(form).subscribe(
      res => {
        if (res.code == 200) {
          console.log('TOKEN', res.token)
          this.tokenStorage.saveToken(res.token);

          console.log(this.tokenStorage.decodeToken(res.token))
          let acc: User = this.tokenStorage.decodeToken(res.token)
          this.tokenStorage.saveUser(acc);

          this.isLoginFailed = false;
          this.isLoggedIn = true;

          this.router.navigateByUrl('/');


        }
      },
      err => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.')
      // data => {
      //   this.tokenStorage.saveToken(data.accessToken);
      //   this.tokenStorage.saveUser(data);

      //   this.isLoginFailed = false;
      //   this.isLoggedIn = true;
      //   this.reloadPage();
      // },
      // err => {
      //   this.error = true;
      //   this.isLoginFailed = true;
      // }
    );

  }

  reloadPage(): void {
    window.location.reload();
  }






}
