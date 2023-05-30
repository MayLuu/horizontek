import { inject, NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { UserService } from "./core/services/user.service";
import { map } from "rxjs/operators";
import { HomePageComponent } from "./features/home-page/home-page.component";
import { LoginPageComponent } from "./features/login-page/login-page.component";
import { InventoryPageComponent } from "./features/inventory-page/inventory-page.component";
import { RegisterPageComponent } from "./features/register-page/register-page.component";
import { InventoryPrintingPageComponent } from "./features/inventory-printing-page/inventory-printing-page.component";
import { AuthGuard } from "./core/services/auth-guard.service";
import { PrinterWarehouseComponent } from "./features/printer-warehouse/printer-warehouse.component";
import { ErrorComponent } from "./features/error/error.component";


const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,

  },

  {
    path: "login",
    component: LoginPageComponent,

  },
  {
    path: "register",
    component: RegisterPageComponent
  },

  {
    path: "inventory",
    component: InventoryPageComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: "inventory/preview",
    component: InventoryPrintingPageComponent,
    // canActivate: [AuthGuard]



  },
  {
    path: "warehouse",
    component: PrinterWarehouseComponent,
  },
  {
    path: "error",
    component: ErrorComponent,
  },
  {
    path: "**",
    redirectTo: "",

  },
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