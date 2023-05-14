import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPrintingPageComponent } from './inventory-printing-page.component';

describe('InventoryPrintingPageComponent', () => {
  let component: InventoryPrintingPageComponent;
  let fixture: ComponentFixture<InventoryPrintingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryPrintingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryPrintingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
