import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdateProductFormComponent } from './view-update-product-form.component';

describe('ViewUpdateProductFormComponent', () => {
  let component: ViewUpdateProductFormComponent;
  let fixture: ComponentFixture<ViewUpdateProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUpdateProductFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUpdateProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
