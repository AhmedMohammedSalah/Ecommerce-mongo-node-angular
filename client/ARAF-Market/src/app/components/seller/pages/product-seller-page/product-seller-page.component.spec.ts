import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSellerPageComponent } from './product-seller-page.component';

describe('ProductSellerPageComponent', () => {
  let component: ProductSellerPageComponent;
  let fixture: ComponentFixture<ProductSellerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSellerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSellerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
