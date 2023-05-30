import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError, HttpErrorHandlerService } from './http-error-handler.service';
import { environment } from 'environment';
import { Observable, interval, take } from 'rxjs';
import { JwtService } from './jwt.service';


const PROGRESS_API = environment.apiUrl + `/printers/00-1B-63-84-45-E6/activities/progress`

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private handleError: HandleError;
  progress$!: Observable<any>;

  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService, private jwtService: JwtService) {
    this.handleError = httpErrorHandler.createHandleError('PrintingService');
  }
  OnInit() {
    console.log('ALO')
    interval(10000).subscribe(x => {
      this.getPrinterProgress()
    })

  }

  getAllPrinters(): Observable<any> {

    let userId = this.jwtService.getUser().id;
    console.log('userId')
    const PRINTER_API = environment.apiUrl + `/users/${userId}/printers`;

    console.log(this.http.get<any>(PRINTER_API))
    return this.http.get<any>(PRINTER_API)

  }
  getPrinterProgress() {
    console.log('PROGRESS')
    console.log(this.http.get<any>(PROGRESS_API).subscribe(data => {
      this.progress$ = data.data;
      console.log(this.progress$)
    }))
    return this.http.get<any>(PROGRESS_API)
  }
}
