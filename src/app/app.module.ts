import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
//form
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { RegisterPageComponent } from './features/register-page/register-page.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { LoginPageComponent } from './features/login-page/login-page.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { InventoryPageComponent } from './features/inventory-page/inventory-page.component';
import { BreadcrumComponent } from './core/layout/breadcrum/breadcrum.component';

//
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchComponent } from './core/layout/search/search.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InventoryPrintingPageComponent } from './features/inventory-printing-page/inventory-printing-page.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { FileExplorerComponent } from './features/file-explorer/file-explorer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { PrinterWarehouseComponent } from './features/printer-warehouse/printer-warehouse.component';
import { ErrorComponent } from './features/error/error.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateDialogComponent } from './core/layout/create-dialog/create-dialog.component';
import { GcodePreviewComponent } from './core/layout/gcode-preview/gcode-preview.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditDialogComponent } from './core/layout/edit-dialog/edit-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    InventoryPageComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumComponent,
    SearchComponent,
    InventoryPrintingPageComponent,
    FileExplorerComponent,
    PrinterWarehouseComponent,
    ErrorComponent,
    CreateDialogComponent,
    GcodePreviewComponent,
    EditDialogComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    MatButtonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    //form
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatTreeModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule




  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
