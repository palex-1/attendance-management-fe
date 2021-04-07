import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExpenseReportComponent } from './my-expense-report.component';

describe('MyExpenseReportComponent', () => {
  let component: MyExpenseReportComponent;
  let fixture: ComponentFixture<MyExpenseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExpenseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
