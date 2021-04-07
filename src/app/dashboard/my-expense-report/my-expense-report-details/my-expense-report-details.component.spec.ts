import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExpenseReportDetailsComponent } from './my-expense-report-details.component';

describe('MyExpenseReportDetailsComponent', () => {
  let component: MyExpenseReportDetailsComponent;
  let fixture: ComponentFixture<MyExpenseReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExpenseReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExpenseReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
