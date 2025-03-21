import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersProfileComponent } from './sellers-profile.component';

describe('SellersProfileComponent', () => {
  let component: SellersProfileComponent;
  let fixture: ComponentFixture<SellersProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellersProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
