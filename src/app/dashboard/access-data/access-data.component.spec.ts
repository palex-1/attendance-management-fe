import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDataComponent } from './access-data.component';

describe('AccessDataComponent', () => {
  let component: AccessDataComponent;
  let fixture: ComponentFixture<AccessDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
