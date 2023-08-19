import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityWisePriceConfigComponent } from './quantity-wise-price-config.component';

describe('QuantityWisePriceConfigComponent', () => {
  let component: QuantityWisePriceConfigComponent;
  let fixture: ComponentFixture<QuantityWisePriceConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuantityWisePriceConfigComponent]
    });
    fixture = TestBed.createComponent(QuantityWisePriceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
