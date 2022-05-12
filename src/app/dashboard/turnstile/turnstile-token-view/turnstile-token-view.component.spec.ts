import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnstileTokenViewComponent } from './turnstile-token-view.component';

describe('TurnstileTokenViewComponent', () => {
  let component: TurnstileTokenViewComponent;
  let fixture: ComponentFixture<TurnstileTokenViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnstileTokenViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnstileTokenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
