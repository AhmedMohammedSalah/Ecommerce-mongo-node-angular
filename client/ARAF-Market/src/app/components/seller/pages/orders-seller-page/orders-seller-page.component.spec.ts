import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSellerPageComponent } from './orders-seller-page.component';

describe('OrdersSellerPageComponent', () => {
  let component: OrdersSellerPageComponent;
  let fixture: ComponentFixture<OrdersSellerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersSellerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersSellerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
