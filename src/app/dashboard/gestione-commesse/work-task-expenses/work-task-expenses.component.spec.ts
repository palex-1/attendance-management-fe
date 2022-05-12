import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTaskExpensesComponent } from './work-task-expenses.component';

describe('WorkTaskExpensesComponent', () => {
  let component: WorkTaskExpensesComponent;
  let fixture: ComponentFixture<WorkTaskExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTaskExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTaskExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
