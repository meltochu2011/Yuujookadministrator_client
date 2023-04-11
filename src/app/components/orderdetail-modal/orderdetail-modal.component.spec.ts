import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdetailModalComponent } from './orderdetail-modal.component';

describe('OrderdetailModalComponent', () => {
  let component: OrderdetailModalComponent;
  let fixture: ComponentFixture<OrderdetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdetailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
