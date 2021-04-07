import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedSelectComponent } from './enhanced-select.component';

describe('EnhancedSelectComponent', () => {
  let component: EnhancedSelectComponent;
  let fixture: ComponentFixture<EnhancedSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnhancedSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnhancedSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
