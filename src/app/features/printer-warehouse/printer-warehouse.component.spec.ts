import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterWarehouseComponent } from './printer-warehouse.component';

describe('PrinterWarehouseComponent', () => {
  let component: PrinterWarehouseComponent;
  let fixture: ComponentFixture<PrinterWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrinterWarehouseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
