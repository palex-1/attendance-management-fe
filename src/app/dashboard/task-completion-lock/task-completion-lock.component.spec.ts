import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCompletionLockComponent } from './task-completion-lock.component';

describe('TaskCompletionLockComponent', () => {
  let component: TaskCompletionLockComponent;
  let fixture: ComponentFixture<TaskCompletionLockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCompletionLockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCompletionLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
