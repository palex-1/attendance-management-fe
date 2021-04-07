import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOfUserModalComponent } from './task-of-user-modal.component';

describe('TaskOfUserModalComponent', () => {
  let component: TaskOfUserModalComponent;
  let fixture: ComponentFixture<TaskOfUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOfUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskOfUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
