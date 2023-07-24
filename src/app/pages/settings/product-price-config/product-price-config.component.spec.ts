import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPriceConfigComponent } from './product-price-config.component';

describe('ProductPriceConfigComponent', () => {
  let component: ProductPriceConfigComponent;
  let fixture: ComponentFixture<ProductPriceConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPriceConfigComponent]
    });
    fixture = TestBed.createComponent(ProductPriceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
