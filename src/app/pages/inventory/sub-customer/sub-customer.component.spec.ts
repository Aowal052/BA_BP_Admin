import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCustomerComponent } from './sub-customer.component';

describe('SubCustomerComponent', () => {
  let component: SubCustomerComponent;
  let fixture: ComponentFixture<SubCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubCustomerComponent]
    });
    fixture = TestBed.createComponent(SubCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
