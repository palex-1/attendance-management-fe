import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerGiornalieroComponent } from './planner-giornaliero.component';

describe('PlannerGiornalieroComponent', () => {
  let component: PlannerGiornalieroComponent;
  let fixture: ComponentFixture<PlannerGiornalieroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerGiornalieroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerGiornalieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
