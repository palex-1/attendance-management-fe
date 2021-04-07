import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnstileDetailsComponent } from './turnstile-details.component';

describe('TurnstileDetailsComponent', () => {
  let component: TurnstileDetailsComponent;
  let fixture: ComponentFixture<TurnstileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnstileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnstileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
