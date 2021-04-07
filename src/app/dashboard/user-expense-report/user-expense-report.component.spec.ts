import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExpenseReportComponent } from './user-expense-report.component';

describe('UserExpenseReportComponent', () => {
  let component: UserExpenseReportComponent;
  let fixture: ComponentFixture<UserExpenseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserExpenseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
