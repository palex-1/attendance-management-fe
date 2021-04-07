import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MontlyReportsComponent } from './montly-reports.component';

describe('MontlyReportsComponent', () => {
  let component: MontlyReportsComponent;
  let fixture: ComponentFixture<MontlyReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MontlyReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MontlyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
