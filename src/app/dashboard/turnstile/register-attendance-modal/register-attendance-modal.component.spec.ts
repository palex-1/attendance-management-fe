import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAttendanceModalComponent } from './register-attendance-modal.component';

describe('RegisterAttendanceModalComponent', () => {
  let component: RegisterAttendanceModalComponent;
  let fixture: ComponentFixture<RegisterAttendanceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAttendanceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAttendanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
