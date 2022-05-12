import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDailyAttendanceComponent } from './export-daily-attendance.component';

describe('ExportDailyAttendanceComponent', () => {
  let component: ExportDailyAttendanceComponent;
  let fixture: ComponentFixture<ExportDailyAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportDailyAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDailyAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
