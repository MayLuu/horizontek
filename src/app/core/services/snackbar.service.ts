import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private _snackBar: MatSnackBar) {
  }

  error(message: string, action: string) {
    return this._snackBar.open(message, action, { panelClass: ['snackbar-error'] });
  }

  success(message: string, action: string) {
    return this._snackBar.open(message, action, { panelClass: ['snackbar-success'] });
  }

  info(message: string, action: string) {
    return this._snackBar.open(message, action, { panelClass: ['snackbar-info'] });
  }

}
