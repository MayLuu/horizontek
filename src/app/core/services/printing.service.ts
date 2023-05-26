import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError, HttpErrorHandlerService } from './http-error-handler.service';
import { Observable } from 'rxjs';
import { environment } from 'environment';
const PRINTING_API = environment.apiUrl + '/activities/'

@Injectable({
  providedIn: 'root'
})

export class PrintingService {
  private handleError: HandleError;

  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService) {
    this.handleError = httpErrorHandler.createHandleError('PrintingService');

  }


  //post to print
  print(formData: any): Observable<any> {
    console.log('print')
    console.log(formData)
    console.log(this.http.post<any>(PRINTING_API, formData))
    return this.http.post<any>(PRINTING_API, formData)

  }
}
