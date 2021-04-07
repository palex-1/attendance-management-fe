import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePaycheckComponent } from './employee-paycheck.component';

describe('EmployeePaycheckComponent', () => {
  let component: EmployeePaycheckComponent;
  let fixture: ComponentFixture<EmployeePaycheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePaycheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePaycheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
