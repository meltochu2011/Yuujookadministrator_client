import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersListCompletedComponent } from './orders-list-completed.component';

describe('OrdersListCompletedComponent', () => {
  let component: OrdersListCompletedComponent;
  let fixture: ComponentFixture<OrdersListCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersListCompletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersListCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
