import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettagliCommessaComponent } from './dettagli-commessa.component';

describe('DettagliCommessaComponent', () => {
  let component: DettagliCommessaComponent;
  let fixture: ComponentFixture<DettagliCommessaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettagliCommessaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettagliCommessaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
