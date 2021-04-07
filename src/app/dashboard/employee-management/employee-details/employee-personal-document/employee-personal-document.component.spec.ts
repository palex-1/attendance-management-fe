import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePersonalDocumentComponent } from './employee-personal-document.component';

describe('EmployeePersonalDocumentComponent', () => {
  let component: EmployeePersonalDocumentComponent;
  let fixture: ComponentFixture<EmployeePersonalDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePersonalDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePersonalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
