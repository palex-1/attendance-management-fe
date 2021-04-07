import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViewEditTurnstileModalComponent } from './add-view-edit-turnstile-modal.component';

describe('AddViewEditTurnstileModalComponent', () => {
  let component: AddViewEditTurnstileModalComponent;
  let fixture: ComponentFixture<AddViewEditTurnstileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddViewEditTurnstileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddViewEditTurnstileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
