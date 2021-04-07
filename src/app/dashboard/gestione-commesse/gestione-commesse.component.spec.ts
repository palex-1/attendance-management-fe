import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneCommesseComponent } from './gestione-commesse.component';

describe('GestioneCommesseComponent', () => {
  let component: GestioneCommesseComponent;
  let fixture: ComponentFixture<GestioneCommesseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestioneCommesseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneCommesseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
