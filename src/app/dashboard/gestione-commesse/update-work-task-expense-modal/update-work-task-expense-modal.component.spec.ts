import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkTaskExpenseModalComponent } from './update-work-task-expense-modal.component';

describe('UpdateWorkTaskExpenseModalComponent', () => {
  let component: UpdateWorkTaskExpenseModalComponent;
  let fixture: ComponentFixture<UpdateWorkTaskExpenseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateWorkTaskExpenseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateWorkTaskExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
