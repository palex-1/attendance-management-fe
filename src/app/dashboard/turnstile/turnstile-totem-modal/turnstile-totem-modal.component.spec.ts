import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnstileTotemModalComponent } from './turnstile-totem-modal.component';

describe('TurnstileTotemModalComponent', () => {
  let component: TurnstileTotemModalComponent;
  let fixture: ComponentFixture<TurnstileTotemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnstileTotemModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnstileTotemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
