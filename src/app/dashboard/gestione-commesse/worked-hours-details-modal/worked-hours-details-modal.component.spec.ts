import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkedHoursDetailsModalComponent } from './worked-hours-details-modal.component';

describe('WorkedHoursDetailsModalComponent', () => {
  let component: WorkedHoursDetailsModalComponent;
  let fixture: ComponentFixture<WorkedHoursDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkedHoursDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkedHoursDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
