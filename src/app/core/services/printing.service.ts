import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError, HttpErrorHandlerService } from './http-error-handler.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintingService {
  printingUrl = 'http://34.101.50.122:8000/api/activities'
  private handleError: HandleError;

  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService) {
    this.handleError = httpErrorHandler.createHandleError('PrintingService');

  }

  //get all printers

  //get printer by Id

  //post to print
  requestPrint(formData: any): Observable<any> {
    console.log(this.http.post<any>(this.printingUrl, formData))
    return this.http.post<any>(this.printingUrl, formData)

  }
}
