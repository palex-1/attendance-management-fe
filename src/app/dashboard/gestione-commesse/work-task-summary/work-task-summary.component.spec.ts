import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTaskSummaryComponent } from './work-task-summary.component';

describe('WorkTaskSummaryComponent', () => {
  let component: WorkTaskSummaryComponent;
  let fixture: ComponentFixture<WorkTaskSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkTaskSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTaskSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
