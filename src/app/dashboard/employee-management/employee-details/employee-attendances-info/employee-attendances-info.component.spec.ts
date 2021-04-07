import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendancesInfoComponent } from './employee-attendances-info.component';

describe('EmployeeAttendancesInfoComponent', () => {
  let component: EmployeeAttendancesInfoComponent;
  let fixture: ComponentFixture<EmployeeAttendancesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAttendancesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendancesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
