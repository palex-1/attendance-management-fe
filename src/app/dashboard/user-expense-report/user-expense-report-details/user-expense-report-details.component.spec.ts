import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExpenseReportDetailsComponent } from './user-expense-report-details.component';

describe('UserExpenseReportDetailsComponent', () => {
  let component: UserExpenseReportDetailsComponent;
  let fixture: ComponentFixture<UserExpenseReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserExpenseReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExpenseReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
