import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SediLavorativeComponent } from './sedi-lavorative.component';

describe('SediLavorativeComponent', () => {
  let component: SediLavorativeComponent;
  let fixture: ComponentFixture<SediLavorativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SediLavorativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SediLavorativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
