import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTaskBudgetSummaryComponent } from './work-task-budget-summary.component';

describe('WorkTaskBudgetSummaryComponent', () => {
  let component: WorkTaskBudgetSummaryComponent;
  let fixture: ComponentFixture<WorkTaskBudgetSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTaskBudgetSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTaskBudgetSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
