import { inject, NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { UserService } from "./core/services/user.service";
import { map } from "rxjs/operators";
import { HomePageComponent } from "./features/home-page/home-page.component";
import { LoginPageComponent } from "./features/login-page/login-page.component";
import { InventoryPageComponent } from "./features/inventory-page/inventory-page.component";
import { RegisterPageComponent } from "./features/register-page/register-page.component";
import { InventoryPrintingPageComponent } from "./features/inventory-printing-page/inventory-printing-page.component";


const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,

  },

  {
    path: "login",
    component: LoginPageComponent,
    // canActivate: [
    //   () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    // ],
  },
  {
    path: "register",
    component: RegisterPageComponent
  },

  {
    path: "inventory",
    component: InventoryPageComponent,


  },
  {
    path: "inventory/preview",
    component: InventoryPrintingPageComponent,


  },

  // {
  //   path: "**",
  // redirectTo: "",

  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }