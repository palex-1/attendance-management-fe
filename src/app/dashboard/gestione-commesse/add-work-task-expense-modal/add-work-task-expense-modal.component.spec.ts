import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkTaskExpenseModalComponent } from './add-work-task-expense-modal.component';

describe('AddWorkTaskExpenseModalComponent', () => {
  let component: AddWorkTaskExpenseModalComponent;
  let fixture: ComponentFixture<AddWorkTaskExpenseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkTaskExpenseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkTaskExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
