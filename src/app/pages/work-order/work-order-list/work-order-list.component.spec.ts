import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderListComponent } from './work-order-list.component';

describe('WorkOrderListComponent', () => {
  let component: WorkOrderListComponent;
  let fixture: ComponentFixture<WorkOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
