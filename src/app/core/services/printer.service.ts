import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError, HttpErrorHandlerService } from './http-error-handler.service';
import { environment } from 'environment';
import { Observable } from 'rxjs';


const PRINTER_API = environment.apiUrl + `/users/768d793f-db86-11ed-be00-0242ac130002/printers/`

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private handleError: HandleError;

  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService) {
    this.handleError = httpErrorHandler.createHandleError('PrintingService');
  }

  getAllPrinters(): Observable<any> {
    console.log(this.http.get<any>(PRINTER_API))
    return this.http.get<any>(PRINTER_API)

  }
}
