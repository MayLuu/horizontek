import { BehaviorSubject, Observable, concatMap, delay, from, of } from 'rxjs';
import { Component } from '@angular/core';
import { Printer } from 'src/app/core/models/printer.model';
import { PrinterService } from 'src/app/core/services/printer.service';

@Component({
  selector: 'app-printer-warehouse',
  templateUrl: './printer-warehouse.component.html',
  styleUrls: ['./printer-warehouse.component.scss']
})
export class PrinterWarehouseComponent {
  printers: Printer[] = [];
  value$ = new BehaviorSubject<number>(0)

  constructor(private printerService: PrinterService) {
    console.log(this.printerService.getAllPrinters().subscribe(data => {
      console.log(data)
      this.printers = data.data;
      console.log(this.printers)
    })
    )
  }
  ngAfterContentInit() {
    const myArray = [1, 2, 3, 4, 10, 20, 30];

    from(myArray).pipe(
      concatMap(item => of(item).pipe(delay(1000)))
    ).subscribe(timedItem => {
      this.value$.next(timedItem)
    });
  }
}
